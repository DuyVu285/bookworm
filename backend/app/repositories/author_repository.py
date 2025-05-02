from sqlmodel import Session, select
from app.models.author_model import Author


class AuthorRepository:
    def __init__(self, db_session: Session):
        self.session = db_session

    def get_all_authors(self) -> list[Author]:
        query = select(Author.id, Author.author_name).order_by(Author.author_name)
        return self.session.exec(query).all()

    def get_author_by_id(self, author_id: int) -> Author | None:
        query = select(Author).where(Author.id == author_id)
        return self.session.exec(query).one_or_none()
