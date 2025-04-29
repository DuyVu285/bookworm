from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from app.db.db import get_session
from app.services.category_service import CategoryService
from app.schemas.category_schema import CategoriesRead

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=CategoriesRead, status_code=status.HTTP_200_OK)
async def get_authors(session: Session = Depends(get_session)):
    service = CategoryService(session)
    return service.get_all_categories()
