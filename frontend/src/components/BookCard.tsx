import React from "react";

type BookCardProps = {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  author_name: string;
  sub_price: number;
};

const BookCard: React.FC<BookCardProps> = ({
  id,
  book_title,
  book_price,
  book_cover_photo,
  author_name,
  sub_price,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/480x640";
  };
  console.log(book_cover_photo);
  return (
    <div className="card bg-base-100 shadow-sm rounded-lg min-h-[18rem] max-w-[20rem]">
      {/* Image section - fixed aspect ratio */}
      <figure className="relative pt-[100%] overflow-hidden rounded-t-lg">
        <img
          src={book_cover_photo}
          alt={book_title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={handleError}
        />
      </figure>

      {/* Body section - fixed height with overflow handling */}
      <div className="card-body p-3 min-h-[8rem] max-w-[18rem] flex flex-col justify-between">
        <h2 className="text-2xl font-semibold line-clamp-2 min-h-[3.5rem]">
          {book_title}
        </h2>
        <h3 className="text-lg text-gray-600 truncate">{author_name}</h3>
      </div>

      {/* Footer section - fixed height */}
      {sub_price > 0 ? (
        <div className="bg-gray-100 text-2xl font-medium p-3 rounded-b-lg">
          <span className="text-gray-400 line-through pr-2">${book_price}</span>
          ${sub_price}
        </div>
      ) : (
        <div className="bg-gray-100 text-2xl font-medium p-3 rounded-b-lg">
          ${book_price}
        </div>
      )}
    </div>
  );
};

export default BookCard;
