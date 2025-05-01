import BookCard from "./BookCard";

type BookGridDisplayProps = {
  books: any[];
  loading: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
};

const BookGridDisplay = ({
  books,
  loading,
  columns = { sm: 1, md: 2, lg: 4 },
  loadingMessage = (
    <div className="flex justify-center items-center w-full">
      <span className="loading loading-spinner loading-xl"></span>
      <span className="text-2xl p-2">Loading</span>
    </div>
  ),
  emptyMessage = <p>No books found.</p>,
}: BookGridDisplayProps) => {
  const gridTemplateColumns = `grid-cols-${columns.sm} sm:grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div>
      {loading ? (
        loadingMessage
      ) : books.length > 0 ? (
        <div
          className={`grid gap-4 w-full justify-center ${gridTemplateColumns}`}
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
