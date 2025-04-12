from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.db.db import get_session
from datetime import datetime

def test_add_and_delete_data():
    # Create a new session
    with next(get_session()) as session:
        # 1. Add a user
        new_user = User(first_name="John", last_name="Doe", email="johndoe@example.com", password="password123")
        session.add(new_user)
        session.commit()
        
        # Retrieve the user ID after insertion
        user_id = new_user.id
        
        # 2. Add an order for the newly created user
        new_order = Order(user_id=user_id, order_amount=99.99, order_date=datetime.utcnow())
        session.add(new_order)
        session.commit()
        
        # Retrieve the order ID after insertion
        order_id = new_order.id
        
        # 3. Add an order item for the newly created order
        new_order_item = OrderItem(order_id=order_id, quantity=1, price=49.99)
        session.add(new_order_item)
        session.commit()
        
        # Now you have a user, an order, and an order item added to the database.
        
        # 4. Check if everything has been added correctly
        added_user = session.query(User).filter(User.id == user_id).first()
        added_order = session.query(Order).filter(Order.id == order_id).first()
        added_order_item = session.query(OrderItem).filter(OrderItem.order_id == order_id).first()
        
        # Assertions to ensure that the records were added (optional, for debugging)
        assert added_user is not None, "User was not added"
        assert added_order is not None, "Order was not added"
        assert added_order_item is not None, "Order item was not added"
        
        print(f"Added User: {added_user.first_name} {added_user.last_name}")
        print(f"Added Order with Amount: {added_order.order_amount}")
        print(f"Added Order Item with Quantity: {added_order_item.quantity} and Price: {added_order_item.price}")
        
        # 5. Delete the data to clean up
        session.delete(added_order_item)
        session.delete(added_order)
        session.delete(added_user)
        session.commit()
        
        # Verify that data is deleted
        deleted_user = session.query(User).filter(User.id == user_id).first()
        deleted_order = session.query(Order).filter(Order.id == order_id).first()
        deleted_order_item = session.query(OrderItem).filter(OrderItem.order_id == order_id).first()
        
        # Assertions to ensure that the records were deleted (optional, for debugging)
        assert deleted_user is None, "User was not deleted"
        assert deleted_order is None, "Order was not deleted"
        assert deleted_order_item is None, "Order item was not deleted"
        
        print("Data deleted successfully.")

# Run the test function
test_add_and_delete_data()
