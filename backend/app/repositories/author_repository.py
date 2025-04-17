from sqlmodel import Session, select
from app.models.author_model import Author


class AuthorRepository:
    def __init__(self, db_session: Session):
        self.session = db_session

    def get_author_by_id(self, author_id: int) -> Author:
        query = select(Author).where(Author.id == author_id)
        return self.session.exec(query).one_or_none()

    def get_author_by_name(self, author_name: str) -> Author:
        query = select(Author).where(Author.author_name == author_name)
        return self.session.exec(query).one_or_none()

    def get_all_authors(self) -> list[Author]:
        query = select(Author)
        return self.session.exec(query).all()

    def create_author(self, author: Author) -> Author:
        author = Author(**author.model_dump())
        self.session.add(author)
        self.session.commit()
        self.session.refresh(author)
        return author

    def update_author(self, author_id: int, updated_data: Author) -> Author:
        author = self.get_author_by_id(author_id)
        data = updated_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(author, key, value)
        self.session.commit()
        self.session.refresh(author)
        return author

    def delete_author(self, author_id: int) -> None:
        self.session.delete(self.get_author_by_id(author_id))
        self.session.commit()
