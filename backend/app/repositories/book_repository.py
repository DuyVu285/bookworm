from datetime import datetime, timezone
import math
from typing import Optional
from sqlmodel import Session, and_, desc, or_, select, func, cast, Float
from sqlalchemy import label

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.models.author_model import Author
from pydantic import BaseModel


class DiscountedBook(BaseModel):
    id: int
    book_title: str
    book_price: float
    book_cover_photo: Optional[str]
    sub_price: float
    author_name: str


class BookRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_book_by_id(self, book_id: int) -> Optional[Book]:
        query = select(Book).where(Book.id == book_id)
        return self.session.exec(query).one_or_none()

    def get_books(
        self,
        page: int = 1,
        limit: int = 20,
        sort: str = "on sale",
        category_id: Optional[int] = None,
        author_id: Optional[int] = None,
        min_rating: Optional[float] = None,
    ) -> dict:
        sort_expression = self._build_sort_expression(sort)

    def get_top_10_most_discounted_books(self) -> list[dict]:
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)
        statement = (
            select(
                Book.id,
                Book.book_title,
                Book.book_price,
                Book.book_cover_photo,
                sub_price,
                Author.author_name,
            )
            .join(Discount, Discount.book_id == Book.id)
            .join(Author, Author.id == Book.author_id)
            .where(self._get_active_discounts())
            .order_by(sub_price.desc())
            .limit(10)
        )
        results = self.session.exec(statement).all()
        return results

    def get_top_8_books(self, sort: str, limit: int = 8) -> list[dict]:
        metrics = {
            "recommended": func.avg(cast(Review.rating_star, Float)),
            "popular": func.count(Review.id),
        }
        metric = metrics.get(sort)
        subquery = (
            select(
                label("book_id", Book.id),
                label("metric", metric),
                label(
                    "sub_price",
                    func.coalesce(Book.book_price - Discount.discount_price, 0.0),
                ),
            )
            .join(Review, Review.book_id == Book.id)
            .outerjoin(Discount, Discount.book_id == Book.id)
            .where(or_(self._get_active_discounts(), Discount.id == None))
            .group_by(Book.id, Discount.discount_price)
            .subquery()
        )
        statement = (
            select(
                Book.id,
                Book.book_title,
                Book.book_price,
                Book.book_cover_photo,
                subquery.c.sub_price,
                Author.author_name,
            )
            .join(subquery, Book.id == subquery.c.book_id)
            .join(Author, Author.id == Book.author_id)
            .order_by(desc(subquery.c.metric), subquery.c.sub_price)
            .limit(limit)
        )
        results = self.session.exec(statement).all()
        return results

    def _get_total_items(self, category_id, author_id, min_rating):
        count_query = self._build_count_query(category_id, author_id, min_rating)
        return self.session.exec(count_query).one()

    def _build_sort_expression(self, sort: str):
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)
        review_count = label("review_count", func.count(Review.id))
        avg_rating = label("avg_rating", func.avg(cast(Review.rating_star, Float)))

        sort_column_map = {
            "on sale": sub_price,
            "price_asc": Book.book_price,
            "price_desc": desc(Book.book_price),
            "popular": desc(review_count),
            "avg_rating": desc(avg_rating),
        }
        return sort_column_map.get(sort)

    def _build_base_query(self, now, category_id=None, author_id=None, min_rating=None):
        sub_price_expr = label("sub_price", Book.book_price - Discount.discount_price)
        review_count_expr = label("review_count", func.count(Review.id))
        avg_rating_expr = label("avg_rating", func.avg(cast(Review.rating_star, Float)))

        query = (
            select(Book, sub_price_expr, review_count_expr, avg_rating_expr)
            .outerjoin(Discount, Discount.book_id == Book.id)
            .outerjoin(Review, Review.book_id == Book.id)
            .where(
                or_(
                    and_(
                        Discount.discount_start_date <= now,
                        Discount.discount_end_date >= now,
                    ),
                    Discount.id == None,
                )
            )
        )
        if category_id:
            query = query.where(Book.category_id == category_id)
        if author_id:
            query = query.where(Book.author_id == author_id)
        if min_rating:
            query = query.having(
                func.avg(cast(Review.rating_star, Float)) >= min_rating
            )
        query = query.group_by(Book.id, Discount.discount_price)
        return query

    def _build_count_query(self, category_id=None, author_id=None, min_rating=None):
        query = select(Book.id)
        if category_id is not None:
            query = query.where(Book.category_id == category_id)
        if author_id is not None:
            query = query.where(Book.author_id == author_id)
        if min_rating is not None:
            query = (
                query.join(Review, Review.book_id == Book.id)
                .group_by(Book.id)
                .having(func.avg(cast(Review.rating_star, Float)) >= min_rating)
            )
        return select(func.count()).select_from(query.subquery())

    @staticmethod
    def _get_active_discounts():
        return and_(
            Discount.discount_start_date <= func.now(),
            Discount.discount_end_date >= func.now(),
        )
