from datetime import datetime, timezone
import math
from typing import List
from sqlmodel import Session, desc, select
from sqlalchemy import func, label, Subquery
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

    def get_all_books_by_pagination(
        self, page: int = 1, limit: int = 20, sort: str = "on sale"
    ) -> dict:
        now = datetime.now(timezone.utc)
        page = max(page, 1)

        if limit not in self.valid_limits:
            limit = self.valid_limits[2]

        offset = (page - 1) * limit
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)

        sort_column_map = {
            "on sale": sub_price,
            "popularity": desc(func.count(Review.id)),
            "price_asc": Book.book_price,
            "price_desc": desc(Book.book_price),
        }

        sort_expr = sort_column_map.get(sort, sub_price)

        count_stmt = (
            select(func.count())
            .select_from(Book)
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now,
                Discount.discount_end_date >= now,
            )
        )
        total_items = self.session.exec(count_stmt).one()

        stmt = (
            select(Book, sub_price)
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now,
                Discount.discount_end_date >= now,
            )
            .group_by(Book.id)
            .order_by(sort_expr)
            .offset(offset)
            .limit(limit)
        )

        # Special handling for "popularity" since it requires joining Review
        review_count = label("review_count", func.count(Review.id))
        if sort == "popularity":
            stmt = (
                select(Book, sub_price, review_count)
                .join(Discount, Discount.book_id == Book.id)
                .join(Review, Review.book_id == Book.id)
                .where(
                    Discount.discount_start_date <= now,
                    Discount.discount_end_date >= now,
                )
                .group_by(Book.id)
                .order_by(desc(review_count))
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

        sub_price = label("sub_price", (Book.book_price - Discount.discount_price))

        stmt = (
            select(
                Book,
                sub_price,
            )
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now, Discount.discount_end_date >= now
            )
            .order_by(desc(sub_price))
            .limit(10)
        )
        return self.session.exec(stmt).all()

    def get_top_8_books(self, sort: str = "recommended") -> List[Book]:
        now = datetime.now(timezone.utc)
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)
        book_id = label("book_id", Book.id)

        sort_strategies = {
            "recommended": label("metric", func.avg(Review.rating_star)),
            "popularity": label("metric", func.count(Review.id)),
        }

        metric_label = sort_strategies.get(sort, sort_strategies["recommended"])

        subquery = (
            select(
                book_id,
                metric_label,
                sub_price,
            )
            .join(Review, Review.book_id == Book.id)
            .join(Discount, Discount.book_id == Book.id)
            .where(
                Discount.discount_start_date <= now, Discount.discount_end_date >= now
            )
            .group_by(Book.id)
            .subquery()
        )

        stmt = (
            select(Book)
            .join(subquery, Book.id == subquery.c.book_id)
            .order_by(desc(subquery.c.metric), subquery.c.sub_price)
            .limit(8)
        )

        return self.session.exec(stmt).all()
