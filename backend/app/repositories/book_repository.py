from typing import Optional
from sqlmodel import Session, and_, case, desc, or_, select, func, cast, Float
from sqlalchemy import label

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.models.author_model import Author


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
    ) -> list[dict]:
        sub_price = label(
            "sub_price",
            func.coalesce(
                case(
                    (
                        and_(
                            Discount.discount_start_date <= func.now(),
                            Discount.discount_end_date >= func.now(),
                        ),
                        Book.book_price - Discount.discount_price,
                    ),
                    else_=Book.book_price,
                ),
                Book.book_price,
            ),
        )

        review_count = label("review_count", func.count(Review.id))
        avg_rating = label("avg_rating", func.avg(cast(Review.rating_star, Float)))
        total_items = label("total_items", func.count(Book.id).over())

        sort_column_map = {
            "on sale": (desc(Discount.discount_price), sub_price),
            "price_asc": sub_price,
            "price_desc": desc(sub_price),
            "popular": (desc(review_count), sub_price),
            "avg_rating": desc(avg_rating),
        }
        sort_expression = sort_column_map.get(sort)

        # Base query for selecting book information
        base_query = (
            select(
                Book.id,
                Book.book_title,
                Book.book_price,
                Book.book_cover_photo,
                Author.author_name,
                sub_price,
            )
            .outerjoin(Discount, Discount.book_id == Book.id)
            .join(Author, Author.id == Book.author_id)
        )

        # Apply filters
        if category_id is not None:
            base_query = base_query.where(Book.category_id == category_id)
        if author_id is not None:
            base_query = base_query.where(Book.author_id == author_id)
        if min_rating is not None:
            base_query = base_query.outerjoin(Review, Review.book_id == Book.id).having(
                func.avg(cast(Review.rating_star, Float)) >= min_rating
            )

        # Query to get the total number of unique books
        total_items_query = select(func.count(Book.id.distinct())).select_from(
            base_query.subquery()
        )
        total_items = self.session.exec(total_items_query).one() or 0

        # Final query to get the paginated and sorted books
        if isinstance(sort_expression, tuple):
            final_query = (
                base_query.group_by(
                    Book.id,
                    Discount.discount_price,
                    Author.id,
                    Discount.discount_start_date,
                    Discount.discount_end_date,
                )
                .order_by(*sort_expression)
                .offset((page - 1) * limit)
                .limit(limit)
            )
        else:
            final_query = (
                base_query.group_by(
                    Book.id,
                    Discount.discount_price,
                    Author.id,
                    Discount.discount_start_date,
                    Discount.discount_end_date,
                )
                .order_by(*sort_expression)
                .offset((page - 1) * limit)
                .limit(limit)
            )
        final_query = final_query.add_columns(total_items)
        results = self.session.exec(final_query).all()
        return results

    def get_top_10_most_discounted_books(self) -> list[dict]:
        sub_price = label(
            "sub_price",
            func.coalesce(Book.book_price - Discount.discount_price, Book.book_price),
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
            .where(self._get_active_discounts())
            .order_by(desc(Discount.discount_price), sub_price)
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

    @staticmethod
    def _get_active_discounts():
        return and_(
            Discount.discount_start_date <= func.now(),
            Discount.discount_end_date >= func.now(),
        )
