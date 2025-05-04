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
  const maxQuantity = 8;

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
    if (currentQty < maxQuantity) {
      dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
      dispatch(
        showToast({ message: "Book quantity increased!", type: "success" })
      );
    } else {
      dispatch(
        showToast({
          message: "You can only add 8 of this book. (Max 8 total)",
          type: "warning",
        })
      );
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      dispatch(updateQuantity({ id, quantity: value }));
    } else {
      dispatch(
        showToast({
          message: "Book quantity must be between 1 and 8.",
          type: "warning",
        })
      );
    }
  };

  return cartItems.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <span className="text-center text-gray-500 text-2xl">
        Your cart is empty
      </span>
    </div>
  ) : (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-box border border-gray-300">
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
                    <div className="flex items-center gap-4">
                      <img
                        className="h-32 w-28 object-cover"
                        src={item.book_cover_photo}
                        alt={item.book_title}
                      />
                      <div className="flex flex-col">
                        <Link
                          to={`/Book/${item.id}`}
                          target="_blank"
                          className="text-2xl font-bold hover:underline"
                        >
                          {item.book_title}
                        </Link>
                        <span className="text-xl font-light">
                          {item.author_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">
                        ${price.toFixed(2)}
                      </span>
                      {item.sub_price && (
                        <span className="text-xl line-through font-light">
                          ${item.book_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-sm join-item bg-gray-200"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="input border-0 text-center join-item input-sm w-12 bg-gray-200"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          handleQuantityChange(item.id, value);
                        }}
                      />
                      <button
                        className="btn btn-sm join-item bg-gray-200"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={item.quantity >= maxQuantity}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="text-2xl font-bold">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-4 ">
        {cartItems.map((item) => {
          const price = item.sub_price || item.book_price;
          return (
            <div key={item.id} className="card bg-gray-100">
              <div className="card-body p-4">
                <div className="flex gap-4">
                  <img
                    className="h-24 w-20 object-cover rounded"
                    src={item.book_cover_photo}
                    alt={item.book_title}
                  />
                  <div className="flex-1">
                    <Link
                      to={`/Book/${item.id}`}
                      className="text-lg font-bold hover:underline line-clamp-2"
                    >
                      {item.book_title}
                    </Link>
                    <p className="text-sm text-gray-500">{item.author_name}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="font-bold">${price.toFixed(2)}</span>
                    {item.sub_price && (
                      <span className="text-sm line-through text-gray-500">
                        ${item.book_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="join">
                    <button
                      className="btn btn-xs join-item bg-gray-200"
                      onClick={() => handleDecrease(item.id, item.quantity)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="input border-0 text-center join-item input-xs w-8 bg-gray-200"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        handleQuantityChange(item.id, value);
                      }}
                    />
                    <button
                      className="btn btn-xs join-item bg-gray-200"
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      disabled={item.quantity >= maxQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">
                    Total: ${(price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CartTable;
