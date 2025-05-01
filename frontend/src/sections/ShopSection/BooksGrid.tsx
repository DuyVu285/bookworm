import { useEffect, useRef, useState } from "react";
import GridToolbar from "../../components/GridToolbar";
import Pagination from "../../components/Pagination";
import bookService from "../../services/bookService";
import { useSearchParams } from "react-router-dom";
import BookGridDisplay from "../../components/BookGridDisplay";

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
    { key: "on sale", label: "On Sale" },
    { key: "popular", label: "Popularity" },
    { key: "price_asc", label: "Price: Low to High" },
    { key: "price_desc", label: "Price: High to Low" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "on sale";
  const rawPage = searchParams.get("page");
  const page = Number.isNaN(Number(rawPage)) ? 1 : parseInt(rawPage || "1");
  const limit = parseInt(searchParams.get("itemsPerPage") || "20") || 20;

  const [books, setBooks] = useState<Book[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    limit: 20,
    total_items: 0,
    total_pages: 1,
    start_item: 1,
    end_item: 20,
  });
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState<React.ReactNode>(undefined);
  const isFetchingRef = useRef(false);

  const getIntParam = (key: string): number | undefined => {
    const value = searchParams.get(key);
    const parsed = parseInt(value || "");
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  useEffect(() => {
    if (isFetchingRef.current) return;

    async function fetchBooks() {
      setLoading(true);
      try {
        const category = getIntParam("Category");
        const author = getIntParam("Author");
        const rating = getIntParam("Rating");

        if (category || author || rating) {
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("page", "1");
            return params;
          });
        }

        isFetchingRef.current = true;
        console.log("Fetching books with params:", {
          page,
          limit,
          sort,
          category,
          author,
          rating,
        });

        const response = await bookService.getBooks({
          page,
          limit,
          sort,
          category,
          author,
          rating,
        });
        setBooks(response.books);
        setPageInfo({
          page: response.page,
          limit: response.limit,
          total_items: response.total_items,
          total_pages: response.total_pages,
          start_item: response.start_item,
          end_item: response.end_item,
        });

        if (response.books.length === 0) {
          setEmptyMessage(
            <p className="text-center text-gray-500">
              No books found matching your filters.
            </p>
          );
        } else {
          setEmptyMessage(undefined); // clear message when results exist
        }
      } catch (error: any) {
        console.error("Failed to fetch books", error);

        if (error?.response?.status === 404) {
          setBooks([]);
          setEmptyMessage(
            <p className="text-center text-red-500">
              No books found (404 Not Found).
            </p>
          );
        } else {
          setEmptyMessage(
            <p className="text-center text-red-500">
              Something went wrong. Please try again later.
            </p>
          );
        }
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }

    fetchBooks();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(newPage));
      return params;
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("itemsPerPage", String(newItemsPerPage));
      params.set("page", "1");
      return params;
    });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("sort", newSort);
      params.set("page", "1");
      return params;
    });
  };

  return (
    <>
      <div className="px-4">
        {/* Grid toolbar */}
        <GridToolbar
          sortOptions={sortOptions}
          startItem={pageInfo.start_item}
          endItem={pageInfo.end_item}
          totalItems={pageInfo.total_items}
          itemType="books"
          onItemsPerPageChange={handleItemsPerPageChange}
          initialItemsPerPage={pageInfo.limit}
          onSortChange={handleSortChange}
          initialSortOption={sort}
        />
        {/* Book grid display */}
        <BookGridDisplay
          books={books}
          loading={loading}
          emptyMessage={emptyMessage}
        />

        {/* Pagination */}
        {pageInfo.total_pages > 1 && (
          <Pagination
            currentPage={pageInfo.page}
            totalPages={pageInfo.total_pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default BooksGrid;
