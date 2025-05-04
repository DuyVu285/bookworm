import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";
import CartTable from "../sections/CartSection/CartTable";
import CartTotals from "../sections/CartSection/CartTotals";
import { RootState } from "../store";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  book_title: string;
  book_price: number;
  sub_price: number;
  quantity: number;
  book_cover_photo: string;
  author_name: string;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    setCartItems(cart);
  });
  return (
    <MainLayout type={`Your Cart: ${totalQuantity} items`}>
      <div className="flex flex-col lg:flex-row mx-18 mb-20 gap-8">
        {/* Cart Table */}
        <div className="w-full lg:w-7/10 ">
          <CartTable cartItems={cartItems}></CartTable>
        </div>

        {/* Cart Totals */}
        <aside className="w-full lg:w-3/10">
          <CartTotals></CartTotals>
        </aside>
      </div>
    </MainLayout>
  );
};
export default CartPage;
