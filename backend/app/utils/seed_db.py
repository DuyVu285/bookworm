from datetime import datetime
from faker import Faker
import pyshorteners
from sqlmodel import SQLModel, Session, create_engine
from random import randint, choice
from app.core.config import settings

from app.models.book_model import Book
from app.models.order_model import Order
from app.models.user_model import User
from app.models.category_model import Category
from app.models.discount_model import Discount
from app.models.author_model import Author
from app.models.order_item_model import OrderItem
from app.models.review_model import Review


from app.models.review_model import Review

# Create a Faker instance
fake = Faker("en_US")
shortener = pyshorteners.Shortener()

# Set up the SQLite engine and session (you can use PostgreSQL or another DB if needed)
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)

# Create the tables in the database (if they don't exist already)
SQLModel.metadata.create_all(engine)


# Function to generate fake categories
def generate_fake_category():
    return Category(category_name=fake.word(), category_description=fake.sentence())


# Function to generate fake books
def generate_fake_book(categories, authors):
    book_cover_url = fake.image_url()
    # Shorten the URL using TinyURL (you can choose other providers)
    try:
        short_url = shortener.tinyurl.short(book_cover_url)
        # Ensure the shortened URL is within the 20-character limit
        if len(short_url) > 20:
            short_url = book_cover_url[
                :20
            ]  # Fallback: Truncate if shortening fails or is too long
    except Exception:
        # Handle cases where URL shortening might fail
        short_url = book_cover_url[:20]  # Fallback: Truncate the original URL

    return Book(
        category_id=choice(categories).id,
        author_id=choice(authors).id,
        book_title=fake.sentence(nb_words=5),
        book_summary=fake.text(),
        book_price=round(randint(100, 500) * 0.5, 2),
        book_cover_photo=short_url,
    )


# Function to generate fake reviews
def generate_fake_review(books):
    return Review(
        book_id=choice(books).id,
        review_title=fake.sentence(),
        review_details=fake.text(),
        review_date=fake.date_between(start_date="-3y", end_date="today"),
        rating_star=randint(1, 5),
    )


# Function to generate fake discounts
def generate_fake_discount(books):
    # Generate a discount_end_date first
    discount_end_date = fake.date_between(start_date=datetime.today(), end_date="+1y")

    # Generate discount_start_date before discount_end_date
    discount_start_date = fake.date_between(
        start_date="-1y", end_date=discount_end_date
    )

    return Discount(
        book_id=choice(books).id,
        discount_start_date=discount_start_date,
        discount_end_date=discount_end_date,
        discount_price=round(randint(50, 300) * 0.5, 2),
    )


# Function to generate fake orders
def generate_fake_order(users):
    return Order(
        user_id=choice(users).id,
        order_amount=round(randint(100, 500) * 0.5, 2),
        order_date=fake.date_this_year(),
    )


# Function to generate fake order items
def generate_fake_order_item(books, orders):
    return OrderItem(
        order_id=choice(orders).id,
        book_id=choice(books).id,
        quantity=randint(1, 5),
        price=round(randint(100, 500) * 0.5, 2),
    )


# Function to generate fake users
def generate_fake_user():
    return User(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        email=fake.email(),
        password=fake.password(),
        admin=choice([True, False]),
    )


def generate_fake_author():
    return Author(
        author_name=fake.name(),
        author_bio=fake.text(),
    )


# Populate the database with fake data
def insert_fake_data():
    with Session(engine) as session:
        # Generate authors and categories
        authors = [generate_fake_author() for _ in range(10)]
        categories = [generate_fake_category() for _ in range(20)]
        session.add_all(authors + categories)
        session.commit()

        # Generate users and commit them
        users = [generate_fake_user() for _ in range(20)]
        session.add_all(users)
        session.commit()  # Commit users to generate IDs

        # Generate books using authors and categories
        books = [generate_fake_book(categories, authors) for _ in range(100)]
        session.add_all(books)
        session.commit()

        # Generate orders using the committed users
        orders = [generate_fake_order(users) for _ in range(50)]
        session.add_all(orders)
        session.commit()  # Commit orders to generate IDs

        # Generate reviews and discounts using committed books
        reviews = [generate_fake_review(books) for _ in range(150)]
        discounts = [generate_fake_discount(books) for _ in range(30)]
        session.add_all(reviews + discounts)
        session.commit()

        # Generate order items using committed books and orders
        order_items = [generate_fake_order_item(books, orders) for _ in range(150)]
        session.add_all(order_items)
        session.commit()

        print("Fake data inserted successfully!")


# Insert fake data
insert_fake_data()

print("Fake data inserted successfully!")
