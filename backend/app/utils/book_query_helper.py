from sqlalchemy import label
from sqlmodel import Float, and_, cast, desc, func, or_, select

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review


class BookQueryHelper:
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

        stmt = (
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
            stmt = stmt.where(Book.category_id == category_id)

        if author_id:
            stmt = stmt.where(Book.author_id == author_id)

        if min_rating:
            stmt = stmt.having(func.avg(cast(Review.rating_star, Float)) >= min_rating)

        stmt = stmt.group_by(Book.id, Discount.discount_price)
        return stmt
