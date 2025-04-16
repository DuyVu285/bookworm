from datetime import datetime, timezone
import math
from typing import List, Optional
from sqlmodel import Session, and_, desc, or_, select, func, cast, Float
from sqlalchemy import label
from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review

from app.helpers.book_query_helper import BookQueryHelper


class BookRepository:
    valid_limits = [5, 15, 20, 25]

    def __init__(self, session: Session):
        self.session = session

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
        stmt = BookQueryHelper.build_base_query(now, category_id, author_id, min_rating)
        stmt = stmt.order_by(sort_expr).offset(offset).limit(limit)

        results = self.session.exec(stmt).all()

        total_items = self._get_total_items(category_id, author_id, min_rating)

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

    def _get_total_items(self, category_id, author_id, min_rating):
        """
        Helper function to build and execute the count query.
        """
        count_stmt = self._build_count_stmt(category_id, author_id, min_rating)
        total_items = self.session.exec(count_stmt).one()
        return total_items

    def _build_count_stmt(self, category_id=None, author_id=None, min_rating=None):
        filters = {
            "category": lambda: select(Book.id).where(Book.category_id == category_id),
            "author": lambda: select(Book.id).where(Book.author_id == author_id),
            "rating": lambda: (
                select(Book.id)
                .join(Review, Review.book_id == Book.id)
                .group_by(Book.id)
                .having(func.avg(cast(Review.rating_star, Float)) >= min_rating)
            ),
        }

        active_filters = [
            ("category", category_id),
            ("author", author_id),
            ("rating", min_rating),
        ]

        # Only pick the first active filter
        for key, value in active_filters:
            if value is not None:
                stmt = filters[key]()
                break
        else:
            stmt = select(Book.id)

        return select(func.count()).select_from(stmt.subquery())

    def _adjust_limit(self, limit):
        """
        Ensures the limit is within the valid_limits range.
        """
        if limit not in self.valid_limits:
            limit = min(self.valid_limits, key=lambda x: abs(x - limit))
        return limit

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

        recommended = label("recommended", func.avg(cast(Review.rating_star, Float)))
        popularity = label("popularity", func.count(Review.id))

        sort_strategies = {
            "recommended": recommended,
            "popularity": popularity,
        }

        metric_label = sort_strategies.get(sort, recommended)
        metric_column_name = metric_label.name

        subquery = (
            select(
                book_id,
                metric_label,
                sub_price,
            )
            .join(Review, Review.book_id == Book.id)
            .outerjoin(Discount, Discount.book_id == Book.id)
            .where(
                or_(
                    and_(
                        Discount.discount_start_date <= now,
                        Discount.discount_end_date >= now,
                    ),
                    Discount.id == None,
                )
            )
            .group_by(Book.id, Discount.discount_price)
            .subquery()
        )

        stmt = (
            select(Book)
            .join(subquery, Book.id == subquery.c.book_id)
            .order_by(
                desc(getattr(subquery.c, metric_column_name)), subquery.c.sub_price
            )
            .limit(8)
        )

        return self.session.exec(stmt).all()
