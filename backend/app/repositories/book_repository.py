from typing import Optional
from sqlmodel import (
    Float,
    Numeric,
    Session,
    and_,
    case,
    desc,
    literal,
    or_,
    select,
    func,
    cast,
)
from sqlalchemy import label

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.models.author_model import Author
from app.models.category_model import Category


class BookRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_book_by_id(self, book_id: int) -> Book:
        max_discount_subq = self._max_discount_subquery()

        sub_price = label(
            "sub_price",
            func.coalesce(
                Book.book_price - max_discount_subq.c.max_discount, Book.book_price
            ),
        )

        query = (
            select(
                Book.book_title,
                Book.book_price,
                Book.book_summary,
                Book.book_cover_photo,
                Author.author_name,
                Category.category_name,
                sub_price,
            )
            .join(Category, Book.category_id == Category.id)
            .join(Author, Book.author_id == Author.id)
            .outerjoin(max_discount_subq, max_discount_subq.c.book_id == Book.id)
            .where(Book.id == book_id)
        )
        result = self.session.exec(query).one_or_none()
        return result

    def get_books(
        self,
        page: int = 1,
        limit: int = 20,
        sort: str = "on sale",
        category_id: Optional[int] = None,
        author_id: Optional[int] = None,
        min_rating: Optional[float] = None,
    ) -> list[dict]:
        max_discount_subq = self._max_discount_subquery()

        sub_price = label(
            "sub_price",
            func.coalesce(
                Book.book_price - max_discount_subq.c.max_discount, Book.book_price
            ),
        )
        is_discounted = label(
            "is_discounted",
            case((max_discount_subq.c.max_discount.isnot(None), 1), else_=0),
        )
        review_count = label("review_count", func.count(Review.id))

        # Mapping for sort options
        sort_column_map = {
            "on sale": (
                desc(is_discounted),
                desc(max_discount_subq.c.max_discount),
                sub_price,
            ),
            "price_asc": sub_price,
            "price_desc": desc(sub_price),
            "popular": (desc(review_count), sub_price),
        }
        sort_expression = sort_column_map.get(sort)

        # --- Filtering query (for total count) ---
        filter_query = select(Book.id).join(Author)

        if category_id is not None:
            filter_query = filter_query.where(Book.category_id == category_id)
        if author_id is not None:
            filter_query = filter_query.where(Book.author_id == author_id)
        if min_rating is not None:
            filter_query = (
                filter_query.outerjoin(Review, Review.book_id == Book.id)
                .group_by(Book.id, Author.id)
                .having(
                    func.round(
                        cast(func.avg(cast(Review.rating_star, Float)), Numeric), 1
                    )
                    >= min_rating
                )
            )

        # --- Total items ---
        total_items_query = select(func.count()).select_from(filter_query.subquery())
        total_items = self.session.exec(total_items_query).one()

        # --- Main base query for results ---
        base_query = (
            select(
                Book.id,
                Book.book_title,
                Book.book_price,
                Book.book_cover_photo,
                sub_price,
                Author.author_name,
                is_discounted,
            )
            .outerjoin(max_discount_subq, max_discount_subq.c.book_id == Book.id)
            .join(Author, Author.id == Book.author_id)
        )

        if category_id is not None:
            base_query = base_query.where(Book.category_id == category_id)
        if author_id is not None:
            base_query = base_query.where(Book.author_id == author_id)
        if min_rating is not None:
            base_query = base_query.outerjoin(Review, Review.book_id == Book.id).having(
                func.round(cast(func.avg(cast(Review.rating_star, Float)), Numeric), 1)
                >= min_rating
            )
        if sort == "popular":
            base_query = base_query.outerjoin(Review, Review.book_id == Book.id)

        # --- Final paginated query ---
        final_query = (
            base_query.group_by(
                Book.id, Author.id, is_discounted, max_discount_subq.c.max_discount
            )
            .order_by(
                *(
                    sort_expression
                    if isinstance(sort_expression, tuple)
                    else [sort_expression]
                )
            )
            .offset((page - 1) * limit)
            .limit(limit)
        )

        # Add total_items to the result columns (optional)
        final_query = final_query.add_columns(literal(total_items).label("total_items"))

        results = self.session.exec(final_query).all()
        return results

    def get_top_10_most_discounted_books(self) -> list[dict]:
        sub_price = label(
            "sub_price",
            func.coalesce(Book.book_price - Discount.discount_price, Book.book_price),
        )

        max_discount_subq = self._max_discount_subquery()

        statement = (
            select(
                Book.id,
                Book.book_title,
                Book.book_price,
                Book.book_cover_photo,
                sub_price,
                Author.author_name,
            )
            .join(max_discount_subq, max_discount_subq.c.book_id == Book.id)
            .join(Author, Author.id == Book.author_id)
            .join(
                Discount,
                (Discount.book_id == max_discount_subq.c.book_id)
                & (Discount.discount_price == max_discount_subq.c.max_discount),
            )
            .order_by(desc(Discount.discount_price), sub_price)
            .limit(10)
        )

        results = self.session.exec(statement).all()
        return results

    def get_top_8_books(self, sort: str, limit: int = 8) -> list[dict]:
        max_discount_subq = self._max_discount_subquery()

        metrics = {
            "recommended": func.round(
                cast(func.avg(cast(Review.rating_star, Float)), Numeric), 1
            ),
            "popular": func.count(Review.id),
        }
        metric = metrics.get(sort)
        print("Current metric:", metric)
        subquery = (
            select(
                label("book_id", Book.id),
                label("metric", metric),
                label(
                    "sub_price",
                    func.coalesce(
                        Book.book_price - max_discount_subq.c.max_discount,
                        Book.book_price,
                    ),
                ),
            )
            .join(Review, Review.book_id == Book.id)
            .outerjoin(max_discount_subq, max_discount_subq.c.book_id == Book.id)
            .group_by(Book.id, max_discount_subq.c.max_discount)
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
            or_(
                Discount.discount_end_date >= func.now(),
                Discount.discount_end_date.is_(None),
            ),
        )

    def _max_discount_subquery(self):
        return (
            select(
                Discount.book_id,
                func.max(Discount.discount_price).label("max_discount"),
            )
            .where(self._get_active_discounts())
            .group_by(Discount.book_id)
            .subquery()
        )
