from fastapi import APIRouter

from app.api.routes.user_route import router as user_router
from app.api.routes.book_route import router as book_router
from app.api.routes.author_route import router as author_router
from app.api.routes.category_route import router as category_router
from app.api.routes.review_route import router as review_router
from app.api.routes.order_with_items_route import router as order_with_items_router

router = APIRouter()

router.include_router(user_router)
router.include_router(book_router)
router.include_router(author_router)
router.include_router(category_router)
router.include_router(review_router)
router.include_router(order_with_items_router)
