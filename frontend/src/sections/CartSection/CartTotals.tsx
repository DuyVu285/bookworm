const CartTotals = () => {
  return (
    <>
      <div className="rounded-box border border-gray-300 bg-base-200">
        <div className="text-xl border-b p-1 border-gray-300 flex items-center justify-center">
          <span className="text-gray-500 p-2">Cart Totals</span>
        </div>
        <div className="p-2 rounded-b-lg flex flex-col items-center justify-center h-64 gap-2">
          <span className="text-3xl font-bold">$99.97</span>
          <div className="join w-[80%]"></div>
          <button className="btn w-[80%] mt-8 text-2xl font-bold bg-base-300">
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CartTotals;
