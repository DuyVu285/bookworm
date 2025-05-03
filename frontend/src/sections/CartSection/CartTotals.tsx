import { useSelector } from "react-redux";
import { RootState } from "../../store";

const CartTotals = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.sub_price ?? item.book_price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const orderItems = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      alert("Order placed successfully!");
      // Optionally dispatch action to clear cart here
    } catch (error) {
      alert("Error placing order.");
      console.error(error);
    }
  };

  return (
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
  );
};

export default CartTotals;
