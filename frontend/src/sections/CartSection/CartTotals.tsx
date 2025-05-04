import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import orderService from "../../services/api/orderService";
import { clearCart, updateItemPrice } from "../../store/cartSlice";
import { useState } from "react";
import Login from "../../components/Login";
import { showToast } from "../../store/toastSlice";

const CartTotals = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isLoggedIn = !!user.id;

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.sub_price ?? item.book_price) * item.quantity,
    0
  );

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
        showToast({ message: "Order placed successfully!", type: "success" })
      );
      dispatch(clearCart());
    } catch (error: any) {
      const errMsg = error?.response?.data?.detail;

      if (
        error.response?.status === 400 &&
        error.response?.data?.updated_book
      ) {
        const updated = error.response.data.updated_book;
        dispatch(updateItemPrice(updated));
        dispatch(
          showToast({
            message: errMsg || "Price has changed.",
            type: "error",
          })
        );
      } else {
        dispatch(
          showToast({
            message: errMsg || "Failed to place order. Please try again.",
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
