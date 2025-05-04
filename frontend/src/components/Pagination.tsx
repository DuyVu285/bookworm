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

  const showEllipsisBefore = startPage > 1;
  const showEllipsisAfter = endPage < totalPages;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Desktop pagination buttons */}
      <div className="join flex flex-wrap justify-center hidden sm:flex">
        <button
          className="join-item btn btn-outline border-gray-300"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </button>

        <button
          className="join-item btn btn-outline border-gray-300"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </button>

        {showEllipsisBefore && (
          <button
            className="join-item btn btn-outline border-gray-300"
            disabled
          >
            ...
          </button>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`join-item btn btn-outline border-gray-300 ${
              currentPage === page
                ? "text-white bg-gray-500 border-gray-500"
                : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {showEllipsisAfter && (
          <button
            className="join-item btn btn-outline border-gray-300"
            disabled
          >
            ...
          </button>
        )}

        <button
          className="join-item btn btn-outline border-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </button>

        <button
          className="join-item btn btn-outline border-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
      </div>

      {/* Mobile dropdown pagination */}
      <div className="block sm:hidden w-full max-w-xs">
        <select
          className="select select-bordered w-full text-white bg-gray-500"
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
