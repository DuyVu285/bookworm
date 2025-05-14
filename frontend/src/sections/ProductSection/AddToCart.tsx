import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addToCart } from "../../store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { showToast } from "../../store/toastSlice";

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
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === bookCart.id)
  );
  const currentQty = cartItem?.quantity || 0;
  const dispatch = useDispatch<AppDispatch>();
  const maxQuantity = 8;
  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const increase = () => {
    if (quantity >= maxQuantity) {
      dispatch(
        showToast({
          message: "You can only add 8 of this book. (Max 8 total)",
          type: "warning",
        })
      );
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (currentQty + quantity > maxQuantity) {
      const allowed = maxQuantity - currentQty;
      dispatch(
        showToast({
          message: `You can only add ${allowed} more of this book.`,
          type: "warning",
        })
      );
      return;
    }

    dispatch(addToCart({ ...bookCart, quantity }));
    dispatch(showToast({ message: "Book added to cart!", type: "success" }));
  };

  return (
    <>
      {/* Add to Cart Section */}
      <div className="rounded-box border border-gray-300">
        <div className="bg-gray-100 text-2xl font-medium p-4 ">
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
            <button
              className="btn join-item w-[20%] bg-gray-200"
              onClick={decrease}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="text"
              className="input border-0 w-full text-center join-item bg-gray-200"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value > 0 && value <= 8) {
                  setQuantity(value);
                } else {
                  dispatch(
                    showToast({
                      message: "Book quantity must be between 1 and 8.",
                      type: "warning",
                    })
                  );
                }
              }}
            />
            <button
              className="btn join-item w-[20%] bg-gray-200"
              onClick={increase}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          <button
            className="btn bg-gray-200 w-[80%] mt-8 text-2xl font-bold"
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
