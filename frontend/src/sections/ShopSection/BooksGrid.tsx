import { useState } from "react";
import BookCard from "../../components/BookCard";
import GridToolbar from "../../components/GridToolbar";
import Pagination from "../../components/Pagination";

const BooksGrid = () => {
  const sortOptions = [
    { key: "sale", label: "On Sale" },
    { key: "popular", label: "Popularity" },
    { key: "asc", label: "Price: Low to High" },
    { key: "desc", label: "Price: High to Low" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Example function to get paginated books (replace with your actual data fetching)
  const getPaginatedBooks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    // In a real application, you would slice your book data here
    const dummyBooks = Array.from({ length: totalItems }, (_, i) => ({
      id: i + 1,
      title: `Book ${i + 1}`,
    }));
    return dummyBooks
      .slice(startIndex, endIndex)
      .map((book) => <BookCard key={book.id} book={book} />);
  };

  return (
    <>
      <div className="px-4">
        {/* Grid toolbar */}
        <GridToolbar
          sortOptions={sortOptions}
          startItem={(currentPage - 1) * itemsPerPage + 1}
          endItem={Math.min(currentPage * itemsPerPage, totalItems)}
          totalItems={totalItems}
          itemType="books"
          onItemsPerPageChange={handleItemsPerPageChange}
          initialItemsPerPage={itemsPerPage}
        />
        {/* Book grid */}
        <div className="items-center w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getPaginatedBooks()}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default BooksGrid;
