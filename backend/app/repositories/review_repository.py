from sqlmodel import Float, Session, asc, cast, desc, func, literal, select
from app.models.review_model import Review


class ReviewRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_review_by_id(self, review_id: int) -> Review:
        query = select(Review).where(Review.id == review_id)
        return self.session.exec(query).one_or_none()

    def create_review(self, review: Review) -> Review:
        review = Review(**review.model_dump())
        self.session.add(review)
        self.session.commit()
        self.session.refresh(review)
        return review

    def get_reviews(
        self,
        book_id: int,
        page: int = 1,
        limit: int = 20,
        sort: str = "newest",
        rating: int = 0,
    ) -> list[dict]:

        # Base query
        base_query = select(
            Review.review_title,
            Review.review_details,
            Review.review_date,
            Review.rating_star,
            Review.book_id,
        ).where(Review.book_id == book_id)

        # Filter by minimum rating
        if rating > 0:
            base_query = base_query.where(cast(Review.rating_star, Float) >= rating)

        # Apply sorting
        sort_column_map = {
            "newest": desc(Review.review_date),
            "oldest": asc(Review.review_date),
        }
        sort_expression = sort_column_map.get(sort, desc(Review.review_date))

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        total_items = self.session.exec(count_query).one()

        # Average rating
        avg_rating_query = select(
            func.round(func.avg(cast(Review.rating_star, Float)), 1)
        ).where(Review.book_id == book_id)
        avg_rating = self.session.exec(avg_rating_query).one() or 0.0

        # Final paginated query
        final_query = (
            base_query.order_by(sort_expression)
            .offset((page - 1) * limit)
            .limit(limit)
            .add_columns(literal(total_items).label("total_items"))
            .add_columns(literal(avg_rating).label("avg_rating"))
        )

        results = self.session.exec(final_query).all()
        return results
