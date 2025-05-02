from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from app.db.db import get_session
from app.services.review_service import ReviewService
from app.schemas.review_schema import ReviewsRead, ReviewRead, ReviewCreate

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=ReviewRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new review",
)
async def create_review(review: ReviewCreate, session: Session = Depends(get_session)):
    service = ReviewService(session)
    return service.create_review(review)
