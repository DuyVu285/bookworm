import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import { Link } from "react-router-dom";

import { showToast } from "../../store/toastSlice";

type CartItem = {
  id: number;
  book_title: string;
  book_price: number;
  sub_price: number;
  quantity: number;
  book_cover_photo: string;
  author_name: string;
};

const CartTable = ({ cartItems }: { cartItems: CartItem[] }) => {
  const dispatch = useDispatch();

  const handleDecrease = (id: number, currentQty: number) => {
    if (currentQty <= 1) {
      dispatch(removeFromCart(id));
      dispatch(
        showToast({ message: "Book removed from cart!", type: "success" })
      );
    } else {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
      dispatch(
        showToast({ message: "Book quantity decreased!", type: "success" })
      );
    }
  };

  const handleIncrease = (id: number, currentQty: number) => {
    if (currentQty < 8) {
      dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
    }
    dispatch(
      showToast({ message: "Book quantity increased!", type: "success" })
    );
  };

  return cartItems.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <span className="text-center text-gray-500 text-2xl">
        Your cart is empty
      </span>
    </div>
  ) : (
    <>
      {/* Cart Table */}
      <div className="overflow-x-auto rounded-box border border-gray-300">
        <table className="table table-zebra w-full bg-gray-100">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-xl font-semibold text-base-content">
                Product
              </th>
              <th className="text-xl font-semibold text-base-content">Price</th>
              <th className="text-xl font-semibold text-base-content">
                Quantity
              </th>
              <th className="text-xl font-semibold text-base-content">Total</th>
            </tr>
          </thead>

          <tbody className="bg-gray-100">
            {cartItems.map((item) => {
              const price = item.sub_price || item.book_price;

              return (
                <tr key={item.id} className="border-b border-gray-300">
                  <td>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <img
                        className="h-32 w-full sm:w-28 object-cover"
                        src={item.book_cover_photo}
                        alt={item.book_title}
                      />
                      <div className="flex flex-col text-center sm:text-left">
                        <Link
                          to={`/Book/${item.id}`}
                          target="_blank"
                          className="text-lg sm:text-2xl font-bold hover:underline"
                        >
                          {item.book_title}
                        </Link>
                        <span className="text-sm sm:text-xl font-light">
                          {item.author_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col items-center sm:items-start">
                      <span className="text-lg sm:text-2xl font-bold">
                        ${price.toFixed(2)}
                      </span>
                      {item.sub_price && (
                        <span className="text-sm sm:text-xl line-through font-light">
                          ${item.book_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-sm join-item"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="input input-bordered text-center join-item input-sm w-12"
                        readOnly
                        value={item.quantity}
                        max={8}
                      />
                      <button
                        className="btn btn-sm join-item"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={item.quantity >= 8}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="text-lg sm:text-2xl font-bold block text-center sm:text-left">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CartTable;
