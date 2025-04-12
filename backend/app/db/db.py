from app.core.config import settings
from sqlmodel import SQLModel, create_engine, Session

from app.models.order_model import Order

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)
    
