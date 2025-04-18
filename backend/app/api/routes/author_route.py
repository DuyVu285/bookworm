from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select

from app.db.db import get_session
from app.models.author_model import Author
from app.schemas.author_schema import AuthorBase, AuthorRead
from app.services.author_service import AuthorService

router = APIRouter(
    prefix="/authors", tags=["authors"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=list[AuthorBase], status_code=status.HTTP_200_OK)
async def get_authors(session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.get_all_authors()


@router.get("/{author_id}", response_model=AuthorRead, status_code=status.HTTP_200_OK)
async def get_author(author_id: int, session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.get_author_by_id(author_id)


@router.post("/", response_model=AuthorRead, status_code=status.HTTP_201_CREATED)
async def create_author(author: AuthorBase, session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.create_author(author)


@router.put("/{author_id}", response_model=AuthorRead, status_code=status.HTTP_200_OK)
async def update_author(
    author_id: int, author: AuthorBase, session: Session = Depends(get_session)
):
    service = AuthorService(session)
    return service.update_author(author_id, author)


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_author(author_id: int, session: Session = Depends(get_session)):
    service = AuthorService(session)
    return service.delete_author(author_id)
