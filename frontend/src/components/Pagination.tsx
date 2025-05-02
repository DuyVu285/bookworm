import { useEffect } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visiblePageCount?: number;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePageCount = 5,
}: PaginationProps) => {
  // Calculate the start and end page for the visible range
  const halfVisible = Math.floor(visiblePageCount / 2);
  let startPage = Math.max(currentPage - halfVisible, 1);
  let endPage = Math.min(currentPage + halfVisible, totalPages);

  if (endPage - startPage < visiblePageCount - 1) {
    if (startPage === 1) {
      endPage = Math.min(visiblePageCount, totalPages);
    } else {
      startPage = Math.max(totalPages - visiblePageCount + 1, 1);
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const showEllipsisBefore = startPage > 1;
  const showEllipsisAfter = endPage < totalPages;

  return (
    <div className="flex flex-col items-center p-8 gap-2">
      {/* Desktop pagination buttons */}
      <div className="join flex flex-wrap justify-center gap-1 sm:gap-0 hidden sm:flex">
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </button>

        <button
          className="join-item btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </button>

        {showEllipsisBefore && (
          <button className="join-item btn btn-outline" disabled>
            ...
          </button>
        )}

        {pageNumbers.map((page) => (
          <input
            key={page}
            className="join-item btn btn-square"
            type="radio"
            name="page-options"
            aria-label={`${page}`}
            checked={currentPage === page}
            onChange={() => onPageChange(page)}
          />
        ))}

        {showEllipsisAfter && (
          <button className="join-item btn btn-outline" disabled>
            ...
          </button>
        )}

        <button
          className="join-item btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </button>

        <button
          className="join-item btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
      </div>

      {/* Mobile dropdown pagination */}
      <div className="block sm:hidden w-full max-w-xs">
        <select
          className="select select-bordered w-full"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
