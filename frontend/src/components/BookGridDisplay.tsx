import BookCard from "./BookCard";

type BookGridDisplayProps = {
  books: any[];
  loading: boolean;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
};

const BookGridDisplay = ({
  books,
  loading,
  loadingMessage = (
    <div className="flex justify-center items-center w-full">
      <span className="loading loading-spinner loading-xl"></span>
      <span className="text-2xl p-2">Loading</span>
    </div>
  ),
  emptyMessage = <p>No books found.</p>,
}: BookGridDisplayProps) => {
  return (
    <div>
      {loading ? (
        loadingMessage
      ) : books.length > 0 ? (
        <div
          className={`grid gap-8 w-full justify-center xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-[300px]">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default BookGridDisplay;
