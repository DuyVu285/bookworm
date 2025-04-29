from datetime import datetime, timezone
import math
from typing import List, Optional
from sqlmodel import Session, desc, or_, select, func, cast, Float
from sqlalchemy import label

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.utils.book_query_helper import BookQueryHelper
from app.models.author_model import Author


class BookRepository:
    valid_limits = [5, 15, 20, 25]

    def __init__(self, session: Session):
        self.session = session

    def get_book_by_id(self, book_id: int) -> Book:
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

        now = datetime.now(timezone.utc)
        page = max(page, 1)

        limit = self._adjust_limit(limit)

        offset = (page - 1) * limit

        sort_expr = BookQueryHelper.build_sort_expr(sort)
        query = BookQueryHelper.build_base_query(
            now, category_id, author_id, min_rating
        )
        query = query.order_by(sort_expr).offset(offset).limit(limit)
        results = self.session.exec(query).all()

        data = []
        for row in results:
            book, sub_price, review_count, avg_rating = row

            data.append(
                {
                    "id": book.id,
                    "book_title": book.book_title,
                    "author_id": book.author_id,
                    "category_id": book.category_id,
                    "book_price": book.book_price,
                    "book_summary": book.book_summary,
                    "book_cover_photo": book.book_cover_photo,
                    "sub_price": sub_price,
                    "review_count": review_count,
                    "avg_rating": avg_rating,
                }
            )

        total_items = self._get_total_items(category_id, author_id, min_rating)

        start_item = offset + 1 if total_items > 0 else 0
        end_item = min(offset + limit, total_items)

        return {
            "data": data,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total_items / limit),
            "total_items": total_items,
            "start_item": start_item,
            "end_item": end_item,
        }

    def get_top_10_most_discounted_books(self) -> list[dict]:
        sub_price = label(
            "sub_price",
            Book.book_price - Discount.discount_price,
        )

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
            .where(BookQueryHelper.get_active_discounts)
            .order_by(sub_price.desc())
            .limit(10)
        )

        result = self.session.exec(statement).all()
        return result

    def get_top_8_books(self, sort: str, limit: int = 8) -> list[dict]:
        metric = self._get_sort_metric(sort)

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
            .where(
                or_(
                    BookQueryHelper.get_active_discounts(),
                    Discount.id == None,
                )
            )
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

        return self.session.exec(statement).all()

    def _get_sort_metric(self, sort: str):
        metrics = {
            "recommended": func.avg(cast(Review.rating_star, Float)),
            "popular": func.count(Review.id),
        }
        return metrics.get(sort, metrics["recommended"])

    def _get_total_items(self, category_id, author_id, min_rating):
        count_query = BookQueryHelper.build_count_query(
            category_id, author_id, min_rating
        )
        return self.session.exec(count_query).one()

    def _adjust_limit(self, limit):
        if limit not in self.valid_limits:
            limit = min(self.valid_limits, key=lambda x: abs(x - limit))
        return limit
