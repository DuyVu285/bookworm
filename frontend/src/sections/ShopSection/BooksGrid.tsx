import { useEffect, useState } from "react";
import GridToolbar from "../../components/GridToolbar";
import Pagination from "../../components/Pagination";
import bookService from "../../services/bookService";
import BookGridDisplay from "../../components/BookGridDisplay";
import { FILTER_KEYS, useQueryFilters } from "../../hooks/useQueryFilters";

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
  const { getParam, getIntParam, updateParams, searchParams } =
    useQueryFilters();
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

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const category = getIntParam(FILTER_KEYS.CATEGORY);
        const author = getIntParam(FILTER_KEYS.AUTHOR);
        const rating = getIntParam(FILTER_KEYS.RATING);
        const page = getIntParam(FILTER_KEYS.PAGE) || 1;
        const sort = getParam(FILTER_KEYS.SORT) || "on sale";
        const limit = getIntParam(FILTER_KEYS.LIMIT) || 20;

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
          setEmptyMessage(undefined);
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
      }
    }

    fetchBooks();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    console.log("Page changed to:", newPage);
    updateParams({
      [FILTER_KEYS.PAGE]: newPage.toString(),
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
          initialItemsPerPage={pageInfo.limit}
          initialSortOption={sortOptions[0].key}
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
