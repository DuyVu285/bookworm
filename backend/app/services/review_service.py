from fastapi import HTTPException, status
from sqlmodel import Session
from app.schemas.review_schema import (
    ReviewCreate,
    ReviewRead,
    ReviewsByIdRead,
    ReviewsStarsDistributionRead,
    ReviewsStarDistributionRead,
)
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
            id=review.id,
            book_id=review.book_id,
            review_title=review.review_title,
            review_details=review.review_details,
            review_date=review.review_date,
            rating_star=review.rating_star,
        )
        return review

    def get_reviews_by_book_id(
        self,
        book_id: int,
        page: int = 1,
        limit: int = 20,
        sort: str = "newest",
        rating: int = 0,
    ) -> ReviewsByIdRead:
        reviews = self.service_repository.get_reviews_by_id(
            book_id, page, limit, sort, rating
        )
        if not reviews:
            return ReviewsByIdRead(
                reviews=[],
                page=0,
                limit=0,
                total_pages=0,
                total_items=0,
                start_item=0,
                end_item=0,
            )

        reviews_with_sort_and_filters = [
            ReviewRead(
                id=review[0],
                book_id=review[1],  # book_id
                review_title=review[2],  # review_title
                review_details=review[3],  # review_details
                review_date=review[4],  # review_date
                rating_star=review[5],  # rating_star
            )
            for review in reviews
        ]

        total_items = reviews[0][-1]
        total_pages = (total_items + limit - 1) // limit
        start_item = (page - 1) * limit + 1
        end_item = min(page * limit, total_items)

        reviews = ReviewsByIdRead(
            reviews=reviews_with_sort_and_filters,
            page=page,
            limit=limit,
            total_pages=total_pages,
            total_items=total_items,
            start_item=start_item,
            end_item=end_item,
        )
        return reviews

    def get_book_reviews_avg_rating(self, book_id: int) -> float:
        avg_rating = self.service_repository.get_book_reviews_avg_rating(book_id)
        if avg_rating is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )

        return avg_rating

    def get_book_reviews_star_distribution(
        self, book_id: int
    ) -> ReviewsStarsDistributionRead:
        reviews = self.service_repository.get_book_reviews_star_distribution(book_id)
        if not reviews:
            reviews_with_star_distribution = [
                ReviewsStarDistributionRead(rating_star=i, count=0) for i in range(1, 6)
            ]
        else:
            star_map = {rating_star: count for rating_star, count in reviews}
            reviews_with_star_distribution = [
                ReviewsStarDistributionRead(rating_star=i, count=star_map.get(i, 0))
                for i in range(1, 6)
            ]

        return ReviewsStarsDistributionRead(reviews=reviews_with_star_distribution)

    def get_total_reviews_by_book_id(
        self,
        book_id: int,
    ) -> int:
        total_reviews = self.service_repository.get_total_reviews_by_book_id(book_id)
        if total_reviews is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return total_reviews
