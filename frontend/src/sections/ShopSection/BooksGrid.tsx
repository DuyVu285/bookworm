import { useState } from "react";
import BookCard from "../../components/BookCard";
import GridToolbar from "../../components/GridToolbar";

const BooksGrid = () => {
  const sortOptions = [
    { key: "sale", label: "On Sale" },
    { key: "popular", label: "Popularity" },
    { key: "asc", label: "Price: Low to High" },
    { key: "desc", label: "Price: High to Low" },
  ];
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className="max-w-screen-xl px-4">
        {/* Grid toolbar */}
        <GridToolbar
          sortOptions={sortOptions}
          startItem={1}
          endItem={10}
          totalItems={100}
          itemType="books"
        />
        {/* Book grid */}
        {/*  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getPaginatedBooks()}
        </div>

        {/* Pagination */}
        {/*  <div className="flex justify-center p-4">
          <div className="join">
            <button
              className="join-item btn btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <input
                key={i}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={`${i + 1}`}
                checked={currentPage === i + 1}
                onChange={() => setCurrentPage(i + 1)}
              />
            ))}

            <button
              className="join-item btn btn-outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div> */}
      </div>
    </>
  );
};

export default BooksGrid;
