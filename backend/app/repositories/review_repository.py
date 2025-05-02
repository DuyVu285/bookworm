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
