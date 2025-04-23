const AddtoCart = () => {
  const decrease = () => {
    const quantity = document.getElementById("quantity") as HTMLInputElement;
    if (parseInt(quantity.value) > 1) {
      quantity.value = (parseInt(quantity.value) - 1).toString();
    }
  };
  const increase = () => {
    const quantity = document.getElementById("quantity") as HTMLInputElement;
    quantity.value = (parseInt(quantity.value) + 1).toString();
  };
  return (
    <section>
      <div className="border border-gray-300">
        <div className="bg-gray-100 text-2xl font-medium rounded-b-lg p-4 ">
          <span className="line-through text-gray-500 p-2">$49.99</span>
          <span className="text-3xl font-bold">$12.99</span>
        </div>
        <div className="p-4 rounded-b-lg flex flex-col items-center justify-center h-64 gap-2">
          <h3 className="w-[80%] text-left ">Quantity</h3>
          <div className="join w-[80%]">
            <button className="btn join-item" onClick={decrease}></button>
            <input
              type="text"
              id="quantity"
              className="input input-bordered w-full text-center join-item "
              value="1"
              min="1"
            />
            <button className="btn join-item" onClick={increase}>
              +
            </button>
          </div>
          <button className="btn w-[80%] mt-8">Add to cart</button>
        </div>
      </div>
    </section>
  );
};

export default AddtoCart;
