from sqlmodel import Session, select, func
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

    def update_review(self, review_id: int, updated_data: Review) -> Review:
        review = self.get_review_by_id(review_id)
        data = updated_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(review, key, value)
        self.session.commit()
        self.session.refresh(review)
        return review

    def delete_review(self, review_id: int) -> None:
        self.session.delete(self.get_review_by_id(review_id))
        self.session.commit()

    def get_reviews_count_by_book_id(self, book_id: int) -> int:
        query = select(func.count(Review.id)).where(Review.book_id == book_id)
        (count,) = self.session.exec(query).one()
        return count

    def get_average_rating_by_book_id(self, book_id: int) -> float:
        query = select(func.avg(Review.rating_star)).where(Review.book_id == book_id)
        (avg_rating,) = self.session.exec(query).one()
        return avg_rating or 0.0
