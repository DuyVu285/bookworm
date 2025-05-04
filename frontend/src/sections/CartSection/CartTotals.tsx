import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import orderService from "../../services/api/orderService";
import { clearCart } from "../../store/cartSlice";
import authService from "../../services/auth/authService";
import { useEffect, useState } from "react";
import Login from "../../components/layout/Login";

const CartTotals = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false); // State to control login dialog

  useEffect(() => {
    // Check if user is logged in when component mounts
    setIsLoggedIn(authService.isLoggedIn());
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.sub_price ?? item.book_price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!isLoggedIn || user.id === null) {
      // Open login dialog if not logged in
      setLoginOpen(true);
      return;
    }

    const orderItems = cart.map((item) => ({
      book_id: item.id,
      quantity: item.quantity,
      price: item.sub_price,
    }));

    const orderData = {
      user_id: user.id,
      order_date: new Date().toISOString(),
      order_amount: totalPrice,
      items: orderItems,
    };

    try {
      await orderService.placeOrder(orderData);
      alert("Order placed successfully!");
      dispatch(clearCart());
    } catch (error: any) {
      const errMsg = error.response?.data?.detail;

      // Check for price mismatch and updated book info
      if (
        error.response?.status === 400 &&
        error.response?.data?.updated_book
      ) {
        const updated = error.response.data.updated_book;

        console.log("Updated book info:", updated);

        dispatch({
          type: "cart/updateItemPrice",
          payload: {
            id: updated.book_id,
            book_price: updated.book_price,
            sub_price: updated.sub_price,
          },
        });

        alert(errMsg || "Item price has changed. Cart updated.");
        return;
      }

      alert(errMsg || "Error placing order.");
      console.error(error);
    }
  };

  const handleLoginClose = () => setLoginOpen(false); // Close login dialog

  return (
    <>
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={handleLoginClose} />}

      <div className="rounded-box border border-gray-300 bg-base-200">
        <div className="text-xl border-b p-1 border-gray-300 flex items-center justify-center">
          <span className="text-gray-500 p-2">Cart Totals</span>
        </div>
        <div className="p-2 rounded-b-lg flex flex-col items-center justify-center h-64 gap-2">
          <span className="text-3xl font-bold">${totalPrice.toFixed(2)}</span>
          <button
            className="btn w-[80%] mt-8 text-2xl font-bold bg-base-300"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CartTotals;
