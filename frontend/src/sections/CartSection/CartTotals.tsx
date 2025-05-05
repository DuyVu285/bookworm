import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import orderService from "../../services/api/orderService";
import {
  clearCart,
  updateItemPrice,
  removeFromCart,
} from "../../store/cartSlice";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import { showToast } from "../../store/toastSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

type User = {
  first_name: string;
  last_name: string;
  id: number;
};
const CartTotals = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.sub_price ?? item.book_price) * item.quantity,
    0
  );

  // User information (first and last name)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user cookie", error);
        setUser(null);
      }
    }
  }, []);
  const isLoggedIn = !!user?.id;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      dispatch(
        showToast({
          message: "Your cart is empty. Add items before placing an order.",
          type: "error",
        })
      );
      return;
    }

    if (!isLoggedIn || user.id === null) {
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

    setIsPlacingOrder(true);

    try {
      await orderService.placeOrder(orderData);
      dispatch(
        showToast({
          message: "Order placed successfully!",
          type: "success",
          duration: 10000,
        })
      );
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/");
      }, 10000);
    } catch (error: any) {
      if (error.response?.status === 400 && error) {
        const updated = error.response.data.detail.updated_book;
        dispatch(updateItemPrice(updated));
        dispatch(
          showToast({
            message: `Price of '${updated.title}' has changed!`,
            type: "error",
          })
        );
      } else if (error.response?.status === 404 && error) {
        console.log(error.response.data.detail);
        const removed = error.response.data.detail.removed_book;
        console.log(removed);
        dispatch(removeFromCart(removed.book_id));
        dispatch(
          showToast({
            message: `A book is no longer available!`,
            type: "error",
          })
        );
      } else {
        dispatch(
          showToast({
            message: "Failed to place order. Please try again!",
            type: "error",
          })
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleLoginClose = () => setLoginOpen(false);

  return (
    <>
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={handleLoginClose} />}

      <div className="rounded-box border border-gray-300 bg-gray-100">
        <div className="text-xl border-b p-1 border-gray-300 flex items-center justify-center">
          <span className="font-semibold p-2">Cart Totals</span>
        </div>
        <div className="p-2 rounded-b-lg flex flex-col items-center justify-center min-h-64 gap-2">
          <span className="text-3xl font-bold">${totalPrice.toFixed(2)}</span>
          <button
            className="btn w-[80%] mt-8 text-2xl font-bold bg-gray-200"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <span className="loading loading-spinner loading-xl"></span>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartTotals;
