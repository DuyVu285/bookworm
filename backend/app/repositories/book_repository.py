from datetime import datetime, timezone
import math
from typing import List
from sqlmodel import Session, desc, select
from sqlalchemy import func, label
from app.models.book_model import Book
from app.models.category_model import Category
from app.models.author_model import Author
from app.models.discount_model import Discount
from app.models.review_model import Review


class BookRepository:
    def __init__(self, session: Session):
        self.valid_limits = [5, 15, 20, 25]
        self.session = session

    def get_all_books(self) -> list[Book]:
        return self.session.exec(select(Book)).all()

    def get_book_by_id(self, book_id: int) -> Book:
        stmt = select(Book).where(Book.id == book_id)
        return self.session.exec(stmt).one_or_none()

    def get_book_by_title(self, book_title: str) -> Book:
        stmt = select(Book).where(Book.book_title == book_title)
        return self.session.exec(stmt).one_or_none()

    def get_book_paginated(self, offset: int, limit: int) -> list[Book]:
        stmt = select(Book).offset(offset).limit(limit)
        return self.session.exec(stmt).all()

    def get_all_discounted_books_by_pagination(
        self, page: int = 1, limit: int = 20
    ) -> dict:
        if limit not in self.valid_limits:
            limit = self.valid_limits[2]

        now = datetime.now(timezone.utc)
        page = max(page, 1)
        offset = (page - 1) * limit

        count_stmt = (
            select(func.count())
            .select_from(Discount)
            .join(Book, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now, Discount.discount_end_date >= now
            )
        )
        total_items = self.session.exec(count_stmt).one()

        sale_price = label((Book.book_price - Discount.discount_price), "sale_price")

        stmt = (
            select(
                Book,
                Discount,
                sale_price,
            )
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now, Discount.discount_end_date >= now
            )
            .order_by(sale_price)
            .offset(offset)
            .limit(limit)
        )
        results = self.session.exec(stmt).all()

        start_item = offset + 1 if total_items > 0 else 0
        end_item = min(offset + limit, total_items)

        return {
            "data": results,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total_items / limit),
            "total_items": total_items,
            "start_item": start_item,
            "end_item": end_item,
        }

    def get_top_10_most_discounted_books(self) -> List[Book]:
        now = datetime.now(timezone.utc)

        sale_price = label((Book.book_price - Discount.discount_price), "sale_price")

        stmt = (
            select(
                Book,
                Discount,
                sale_price,
            )
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now, Discount.discount_end_date >= now
            )
            .order_by(sale_price)
            .limit(10)
        )
        return self.session.exec(stmt).all()

    def get_top_8_recommended_books(self) -> List[Book]:
        subquery = (
            select(
                Book.id.label("book_id"),
                func.avg(Review.rating_star).label("avg_rating"),
                label(Book.book_price - Discount.discount_price, "final_price"),
            )
            .join(Review, Review.book_id == Book.id)
            .join(Discount, Discount.book_id == Book.id)
            .group_by(Book.id)
            .subquery()
        )

        stmt = (
            select(Book)
            .join(subquery, Book.id == subquery.c.book_id)
            .order_by(desc(subquery.c.avg_rating), subquery.c.final_price)
            .limit(8)
        )

        return self.session.exec(stmt).all()

    def get_top_8_popular_books(self) -> List[Book]:
        subquery = (
            select(
                Book.id.label("book_id"),
                func.count(Review.id).label("review_count"),
                label(Book.book_price - Discount.discount_price, "final_price"),
            )
            .join(Review, Review.book_id == Book.id)
            .join(Discount, Discount.book_id == Book.id)
            .group_by(Book.id)
            .subquery()
        )

        stmt = (
            select(Book)
            .join(subquery, Book.id == subquery.c.book_id)
            .order_by(desc(subquery.c.review_count), subquery.c.final_price)
            .limit(8)
        )

        return self.session.exec(stmt).all()

    def create_book(self, book: Book) -> Book:
        self.session.add(book)
        self.session.commit()
        self.session.refresh(book)
        return book

    def update_book(self, book_id: int, updated_data: dict) -> Book | None:
        book = self.get_book_by_id(book_id)
        if not book:
            return None
        for key, value in updated_data.items():
            setattr(book, key, value)
        self.session.add(book)
        self.session.commit()
        self.session.refresh(book)
        return book

    def delete_book(self, book: Book) -> None:
        self.session.delete(book)
        self.session.commit()
