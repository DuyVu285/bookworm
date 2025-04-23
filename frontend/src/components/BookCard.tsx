const BookCard = () => {
  return (
    <div className="card bg-base-100 w-full shadow-sm rounded-lg">
      <figure className="overflow-hidden rounded-t-lg">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Book"
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-3">
        <h2 className="text-md font-semibold truncate">Book Title</h2>
        <h3 className="text-sm text-gray-600 truncate">Author Name</h3>
      </div>
      <div className="bg-gray-100 text-sm font-medium p-3 rounded-b-lg">
        $12.99
      </div>
    </div>
  );
};

export default BookCard;
