from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from app.db.db import get_session
from app.services.review_service import ReviewService
from app.schemas.review_schema import (
    ReviewsByIdRead,
    ReviewRead,
    ReviewCreate,
    ReviewsByIdQueryParams,
    ReviewsAvgRatingRead,
    ReviewsStarsDistributionRead,
)

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/",
    response_model=ReviewsByIdRead,
    status_code=status.HTTP_200_OK,
)
async def get_reviews_by_book_id(
    params: ReviewsByIdQueryParams = Depends(), session: Session = Depends(get_session)
):
    service = ReviewService(session)
    data = service.get_reviews_by_book_id(
        book_id=params.book_id,
        page=params.page,
        limit=params.limit,
        sort=params.sort,
        rating=params.rating,
    )

    return data


@router.get(
    "/average",
    response_model=ReviewsAvgRatingRead,
    status_code=status.HTTP_200_OK,
)
async def get_avg_rating_by_book_id(
    book_id: int, session: Session = Depends(get_session)
):
    service = ReviewService(session)
    data = service.get_book_reviews_avg_rating(book_id=book_id)
    return data


@router.get(
    "/distribution",
    response_model=ReviewsStarsDistributionRead,
    status_code=status.HTTP_200_OK,
)
async def get_book_reviews_star_distribution(
    book_id: int, session: Session = Depends(get_session)
):
    service = ReviewService(session)
    data = service.get_book_reviews_star_distribution(book_id=book_id)
    return data


@router.post(
    "/",
    response_model=ReviewRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new review",
)
async def create_review(review: ReviewCreate, session: Session = Depends(get_session)):
    service = ReviewService(session)
    return service.create_review(review)
