const BookCard = () => {
  return (
    <div className="card bg-base-100 h-100 w-80 card-lg shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="h-60 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title">Book Title</h2>
        <h3>Author Name</h3>
      </div>
      <div className=" bg-gray-100">
        <p className="p-4">Price</p>
      </div>
    </div>
  );
};

export default BookCard;
