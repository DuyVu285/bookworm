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

  // Adjust the range if there are not enough pages before or after the current page
  if (endPage - startPage < visiblePageCount - 1) {
    if (startPage === 1) {
      endPage = Math.min(visiblePageCount, totalPages);
    } else {
      startPage = Math.max(totalPages - visiblePageCount + 1, 1);
    }
  }

  // Create the page numbers to display
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Add ellipsis if needed
  const showEllipsisBefore = startPage > 1;
  const showEllipsisAfter = endPage < totalPages;

  return (
    <div className="flex justify-center p-4">
      <div className="join">
        {/* First Page Button */}
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </button>

        {/* Previous Page Button */}
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </button>

        {/* Ellipsis before if needed */}
        {showEllipsisBefore && (
          <button className="join-item btn btn-outline" disabled>
            ...
          </button>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <input
            key={page}
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label={`${page}`}
            checked={currentPage === page}
            onChange={() => onPageChange(page)}
          />
        ))}

        {/* Ellipsis after if needed */}
        {showEllipsisAfter && (
          <button className="join-item btn btn-outline" disabled>
            ...
          </button>
        )}

        {/* Next Page Button */}
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </button>

        {/* Last Page Button */}
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
