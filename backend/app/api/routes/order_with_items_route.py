from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session
from app.db.db import get_session

from app.services.order_service import OrderService
from app.services.order_item_service import OrderItemService
from app.schemas.order_with_items_schema import OrderWithItemsCreate, OrderWithItemsRead
from app.schemas.order_item_schema import OrderItemCreate
from app.schemas.order_schema import OrderCreate
from app.services.book_service import BookService

router = APIRouter(
    prefix="/place-order",
    tags=["orders"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=OrderWithItemsRead,
    status_code=status.HTTP_201_CREATED,
)
async def place_order(
    order_data: OrderWithItemsCreate,
    session: Session = Depends(get_session),
):
    order_service = OrderService(session)
    order_item_service = OrderItemService(session)
    book_service = BookService(session)

    for item in order_data.items:
        book = book_service.get_book_by_id(item.book_id)
        sub_price = book.sub_price

        if item.price != sub_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": f"Price for '{book.book_title}' has changed.",
                    "updated_book": {
                        "book_id": item.book_id,
                        "title": book.book_title,
                        "book_price": book.book_price,
                        "sub_price": book.sub_price,
                    },
                },
            )

    order = OrderCreate(
        user_id=order_data.user_id,
        order_date=order_data.order_date,
        order_amount=order_data.order_amount,
    )
    # 1. Create order
    order = order_service.create_order(order)

    # 2. Prepare OrderItemCreate objects
    item_inputs = [
        OrderItemCreate(
            order_id=order.id,
            book_id=item.book_id,
            quantity=item.quantity,
            price=item.price,
        )
        for item in order_data.items
    ]

    # 3. Create items in DB
    order_item_service.create_multiple_order_items(item_inputs)

    order_items = order_item_service.get_items_by_order_id(order.id)

    return OrderWithItemsRead(
        id=order.id,
        user_id=order.user_id,
        order_date=order.order_date,
        order_amount=order.order_amount,
        items=order_items,
    )
