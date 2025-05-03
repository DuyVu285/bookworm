import MainLayout from "../components/layout/MainLayout";
import CartTable from "../sections/CartSection/CartTable";
import CartTotals from "../sections/CartSection/CartTotals";

const CartPage = () => {
  return (
    <MainLayout>
      <h2 className="text-2xl font-semibold py-6 border-b border-gray-300 mx-18 mb-6">
        Your cart: 3 items
      </h2>
      <div className="flex flex-col lg:flex-row mx-18 mb-20 gap-8">
        {/* Cart Table */}
        <div className="w-full lg:w-7/10 ">
          <CartTable></CartTable>
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
