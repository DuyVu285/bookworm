type BookDetails = {
  book_title?: string;
  book_price?: number;
  book_summary?: string;
  book_cover_photo?: string;
  author_name?: string;
  category_name?: string;
};

const BookDetails = ({ book }: { book: BookDetails }) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/480x640";
  };
  return (
    <>
      <div className="rounded-box flex flex-col lg:flex-row border border-gray-300 min-h-[25rem]">
        {/* Aside Image */}
        <aside className="w-full lg:w-1/3">
          <img
            src={book.book_cover_photo || "https://placehold.co/480x640"}
            alt={book.book_title}
            className="rounded-tl-lg h-60 w-full object-cover"
            onError={handleError}
          />
          <span className="flex justify-end p-2">By {book.author_name}</span>
        </aside>

        {/* Book Details */}
        <div className="w-full lg:w-2/3 p-4">
          <h2 className="text-4xl font-semibold">{book.book_title}</h2>
          <br />
          <span className="text-2xl">Book Description</span>
          <p className="text-2xl max-h-64 overflow-y-auto whitespace-pre-line">
            {book.book_summary || "No summary available."}
          </p>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
