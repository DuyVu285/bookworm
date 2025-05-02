from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from app.db.db import get_session
from app.schemas.author_schema import AuthorsRead, AuthorRead
from app.services.author_service import AuthorService

router = APIRouter(
    prefix="/authors", tags=["authors"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=AuthorsRead, status_code=status.HTTP_200_OK)
async def get_authors(session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.get_all_authors()


@router.get("/{author_id}", response_model=AuthorRead, status_code=status.HTTP_200_OK)
async def get_author_by_id(author_id: int, session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.get_author_by_id(author_id)
