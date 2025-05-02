from sqlmodel import Session
from app.schemas.review_schema import ReviewCreate, ReviewRead
from app.repositories.review_repository import ReviewRepository


class ReviewService:
    def __init__(self, session: Session):
        self.service_repository = ReviewRepository(session)

    def create_review(self, review: ReviewCreate) -> ReviewRead:
        review = self.service_repository.create_review(review)
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
            )
        review = ReviewRead(
            book_id=review.book_id,
            review_title=review.review_title,
            review_details=review.review_details,
            review_date=review.review_date,
            rating_star=review.rating_star,
        )
        return review
