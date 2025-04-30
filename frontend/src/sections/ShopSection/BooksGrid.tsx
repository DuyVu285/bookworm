import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard"; // You might not need this import directly anymore
import GridToolbar from "../../components/GridToolbar";
import Pagination from "../../components/Pagination";
import bookService from "../../services/bookService"; // Assuming you need bookService here
import { useSearchParams } from "react-router-dom";
import BookGridDisplay from "../../components/BookGridDisplay"; // Import the reusable component

type Book = {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  author_name: string;
  sub_price: number;
};

const BooksGrid = () => {
  const sortOptions = [
    { key: "sale", label: "On Sale" },
    { key: "popular", label: "Popularity" },
    { key: "asc", label: "Price: Low to High" },
    { key: "desc", label: "Price: High to Low" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState(
    searchParams.get("sort") || sortOptions[0].key
  );
  // ... (any filter state you have)

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const limit = itemsPerPage;
        const offset = (currentPage - 1) * itemsPerPage;
        const category = searchParams.get("Category") || undefined;
        const author = searchParams.get("Author") || undefined;
        const rating = searchParams.get("Rating") || undefined;

        const response = await bookService.getBooks({
          sort,
          limit,
          offset,
          category,
          author,
          rating,
        });
        setBooks(response.data);
        setTotalItems(response.total); // Assuming your API returns total count
      } catch (error) {
        console.error("Failed to fetch books", error);
        // Optionally set an error state
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [sort, currentPage, itemsPerPage, searchParams]); // Depend on all relevant state

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1); // Reset page on sort
    // Update URL if needed
  };

  return (
    <>
      <div className="max-w-screen-xl px-4">
        {/* Grid toolbar */}
        <GridToolbar
          sortOptions={sortOptions}
          startItem={(currentPage - 1) * itemsPerPage + 1}
          endItem={Math.min(currentPage * itemsPerPage, totalItems)}
          totalItems={totalItems}
          itemType="books"
          onItemsPerPageChange={handleItemsPerPageChange}
          initialItemsPerPage={itemsPerPage}
          onSortChange={handleSortChange} // Assuming GridToolbar can also trigger sort changes
          initialSortOption={sort}
        />
        {/* Book grid display */}
        <BookGridDisplay books={books} loading={loading} />

        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default BooksGrid;
