import { useState } from "react";
import Toast from "../../components/Toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addToCart } from "../../store/cartSlice";
type BookCart = {
  id: number;
  book_title: string;
  book_price: number;
  sub_price: number;
  book_cover_photo: string;
  author_name: string;
};

const AddtoCart = ({ bookCart }: { bookCart: BookCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const showToast = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info"
  ) => {
    setToast({ message, type });
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const increase = () => {
    if (quantity >= 8) {
      showToast("Maximum quantity is 8 books.", "warning");
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...bookCart, quantity }));
    showToast(`${quantity} book(s) added to cart!`, "success");
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      {/* Add to Cart Section */}
      <div className="rounded-box border border-gray-300">
        <div className="bg-gray-100 text-2xl font-medium p-4">
          {bookCart.book_price === bookCart.sub_price ? (
            <span className="text-3xl font-bold pl-4">
              ${bookCart.book_price}
            </span>
          ) : (
            <>
              <span className="text-gray-400 line-through pl-4 pr-2">
                ${bookCart.book_price}
              </span>
              <span className="text-3xl font-bold">${bookCart.sub_price}</span>
            </>
          )}
        </div>

        <div className="p-2 rounded-b-lg flex flex-col items-center justify-center h-64 gap-2">
          <h3 className="w-[80%] text-left">Quantity</h3>
          <div className="join w-[80%]">
            <button className="btn join-item w-[20%]" onClick={decrease}>
              -
            </button>
            <input
              type="text"
              className="input input-bordered w-full text-center join-item"
              value={quantity}
              readOnly
            />
            <button className="btn join-item w-[20%]" onClick={increase}>
              +
            </button>
          </div>
          <button
            className="btn btn-primary w-[80%] mt-8 text-2xl font-semibold"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
};

export default AddtoCart;
