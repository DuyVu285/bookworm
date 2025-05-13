from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError as ESConnectionError
import logging
from sqlmodel import Session, select
from app.models.book_model import Book

logging.basicConfig(level=logging.DEBUG)


class ElasticService:
    def __init__(
        self,
        session: Session,
        host: str = "http://localhost:9200",
        index_name: str = "books",
    ):
        self.es = Elasticsearch(host, request_timeout=10)
        self.index = index_name
        self.session = session

    def check_connection(self) -> bool:
        try:
            return self.es.ping()
        except ESConnectionError as e:
            logging.error(f"Elasticsearch connection error: {e}")
            return False

    def init_index(self):
        if not self.es.indices.exists(index=self.index):
            self.es.indices.create(index=self.index)
            logging.info(f"Created index: {self.index}")
        else:
            logging.info(f"Index already exists: {self.index}")

    def sync_books(self):
        query = select(Book.id, Book.book_title, Book.book_cover_photo)
        books = self.session.exec(query).all()
        for book in books:
            self.es.index(
                index=self.index,
                id=book.id,
                body={
                    "title": book.book_title,
                    "book_cover_photo": book.book_cover_photo,
                },
            )
        logging.info(f"Synchronized {len(books)} books to Elasticsearch.")
