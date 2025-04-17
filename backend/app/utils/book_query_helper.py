from datetime import datetime, timezone
import math
from sqlalchemy import label
from sqlmodel import Float, and_, cast, desc, func, or_, select

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review


class BookQueryHelper:

    @staticmethod
    def build_paginated_query(sort, category_id, author_id, min_rating, offset, limit):
        now = datetime.now(timezone.utc)
        sort_expr = BookQueryHelper.build_sort_expr(sort)
        query = BookQueryHelper.build_base_query(now, category_id, author_id, min_rating)
        return query.order_by(sort_expr).offset(offset).limit(limit)

    @staticmethod
    def build_top_discounted_query():
        sub_price = label("sub_price", (Book.book_price - Discount.discount_price))
        return (
            select(Book, sub_price)
            .join(Discount, Discount.book_id == Book.id)
            .where(BookQueryHelper.get_active_discounts())
            .order_by(desc(sub_price))
            .limit(10)
        )

    @staticmethod
    def build_top_books_query(sort):
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
                    BookQueryHelper.get_active_discounts(),
                    Discount.id == None,
                )
            )
            .group_by(Book.id, Discount.discount_price)
            .subquery()
        )

        return (
            select(Book)
            .join(subquery, Book.id == subquery.c.book_id)
            .order_by(
                desc(getattr(subquery.c, metric_column_name)),
                subquery.c.sub_price,
            )
            .limit(8)
        )

    @staticmethod
    def format_book_row(row):
        book, sub_price, review_count, avg_rating = row
        return {
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

    @staticmethod
    def paginated_response(data, page, limit, total_items, offset):
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

    @staticmethod
    def build_sort_expr(sort: str):
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)
        review_count = label("review_count", func.count(Review.id))
        avg_rating = label("avg_rating", func.avg(cast(Review.rating_star, Float)))

        sort_column_map = {
            "on sale": sub_price,
            "price_asc": Book.book_price,
            "price_desc": desc(Book.book_price),
            "popularity": desc(review_count),
            "avg_rating": desc(avg_rating),
        }

        return sort_column_map.get(sort, sub_price)

    @staticmethod
    def build_base_query(now, category_id=None, author_id=None, min_rating=None):
        sub_price = label("sub_price", Book.book_price - Discount.discount_price)
        review_count = label("review_count", func.count(Review.id))
        avg_rating = label("avg_rating", func.avg(cast(Review.rating_star, Float)))

        query = (
            select(Book, sub_price, review_count, avg_rating)
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
            query = query.having(func.avg(cast(Review.rating_star, Float)) >= min_rating)

        query = query.group_by(Book.id, Discount.discount_price)
        return query

    @staticmethod
    def build_count_query(category_id=None, author_id=None, min_rating=None):
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

        for key, value in active_filters:
            if value is not None:
                query = filters[key]()
                break
        else:
            query = select(Book.id)

        return select(func.count()).select_from(query.subquery())

    @staticmethod
    def get_active_discounts():
        now = datetime.now(timezone.utc)
        return and_(
            Discount.discount_start_date <= now,
            Discount.discount_end_date >= now,
        )
