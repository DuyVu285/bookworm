from app.core.config import settings
from sqlmodel import SQLModel, create_engine, Session

from app.models.order_model import Order
from app.models.user_model import User
from app.models.order_item_model import OrderItem
from app.models.book_model import Book
from app.models.category_model import Category
from app.models.author import Author
from app.models.discount_model import Discount
from app.models.review_model import Review

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)
    
