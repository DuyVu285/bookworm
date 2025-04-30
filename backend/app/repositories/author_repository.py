from sqlmodel import Session, select
from app.models.author_model import Author


class AuthorRepository:
    def __init__(self, db_session: Session):
        self.session = db_session

    def get_all_authors(self) -> list[Author]:
        query = select(Author.id, Author.author_name).order_by(Author.author_name)
        return self.session.exec(query).all()
