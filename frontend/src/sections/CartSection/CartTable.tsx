const CartTable = () => {
  const decrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = e.currentTarget.parentElement?.querySelector(
      "input"
    ) as HTMLInputElement;
    if (parseInt(input.value) > 1) {
      input.value = (parseInt(input.value) - 1).toString();
    }
  };

  const increase = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = e.currentTarget.parentElement?.querySelector(
      "input"
    ) as HTMLInputElement;
    input.value = (parseInt(input.value) + 1).toString();
  };

  return (
    <div className="overflow-x-auto rounded-box border border-gray-400 bg-base-300">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="border-b border-gray-400 text-xl sm:text-base">
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((row, index) => (
            <tr key={index} className="border-b border-gray-400">
              <td>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <img
                    className="h-32 w-full sm:w-28 object-cover"
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Book"
                  />
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-lg sm:text-2xl font-bold">
                      Book Title
                    </span>
                    <span className="text-sm sm:text-xl font-light">
                      Author Name
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-lg sm:text-2xl font-bold">$29.99</span>
                  <span className="text-sm sm:text-xl line-through font-light">
                    $49.99
                  </span>
                </div>
              </td>
              <td>
                <div className="join">
                  <button className="btn btn-sm join-item" onClick={decrease}>
                    -
                  </button>
                  <input
                    type="text"
                    className="input input-bordered text-center join-item input-sm w-12"
                    defaultValue="1"
                    min="1"
                  />
                  <button className="btn btn-sm join-item" onClick={increase}>
                    +
                  </button>
                </div>
              </td>
              <td>
                <span className="text-lg sm:text-2xl font-bold block text-center sm:text-left">
                  $29.99
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
