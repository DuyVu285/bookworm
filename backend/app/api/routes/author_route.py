from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from app.db.db import get_session
from app.schemas.author_schema import AuthorsRead
from app.services.author_service import AuthorService

router = APIRouter(
    prefix="/authors", tags=["authors"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=AuthorsRead, status_code=status.HTTP_200_OK)
async def get_authors(session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.get_all_authors()
