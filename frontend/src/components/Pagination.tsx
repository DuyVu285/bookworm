type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex justify-center p-4">
      <div className="join">
        <button
          className="join-item btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
            onChange={() => onPageChange(i + 1)}
          />
        ))}

        <button
          className="join-item btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
