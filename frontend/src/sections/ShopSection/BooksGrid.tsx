import { useState } from "react";
import BookCard from "../../components/BookCard";

const BooksGrid = () => {
  const sortOptions = [
    "on sale",
    "popularity",
    "price: low to high",
    "price: high to low",
  ];
  const ItemsShowOptions = [5, 15, 20, 25];
  const [selectedOption, setSelectedOption] = useState(sortOptions[0]);
  const [selectedItems, setSelectedItems] = useState(ItemsShowOptions[2]);
  const [currentPage, setCurrentPage] = useState(1);

  const numberOfBooks = 126;
  const totalPages = Math.ceil(numberOfBooks / selectedItems);

  const handleSortChange = (option: string) => {
    setSelectedOption(option);
    setCurrentPage(1);
  };

  const handleItemsChange = (count: number) => {
    setSelectedItems(count);
    setCurrentPage(1);
  };

  const SortDropdown = ({
    sortOptions,
    setSelectedOption,
  }: {
    sortOptions: string[];
    setSelectedOption: (option: string) => void;
  }) => (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
    >
      {sortOptions.map((option, index) => (
        <li key={index}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOption(option);
            }}
          >
            Sort by {option}
          </a>
        </li>
      ))}
    </ul>
  );

  const ItemsDropdown = ({
    ItemsShowOptions,
    setSelectedItems,
  }: {
    ItemsShowOptions: number[];
    setSelectedItems: (option: number) => void;
  }) => (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
    >
      {ItemsShowOptions.map((option, index) => (
        <li key={index}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItems(option);
            }}
          >
            Show {option}
          </a>
        </li>
      ))}
    </ul>
  );

  const getPaginatedBooks = () => {
    const start = (currentPage - 1) * selectedItems;
    const end = start + selectedItems;

    const books = Array.from({ length: numberOfBooks }, (_, i) => (
      <BookCard key={`book-${i}`} />
    ));

    return books.slice(start, end).map((card, index) => (
      <div key={index} className="w-full shrink-0">
        {card}
      </div>
    ));
  };

  const startBook = (currentPage - 1) * selectedItems + 1;
  const endBook = Math.min(currentPage * selectedItems, numberOfBooks);

  return (
    <section className="max-w-screen-xl px-4">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 py-4">
        <h3 className="mt-2">
          Showing {startBook}-{endBook} of {numberOfBooks} books
        </h3>

        <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-4">
          <div className="dropdown w-full md:w-[220px]">
            <div
              tabIndex={0}
              role="button"
              className="btn w-full justify-between text-left truncate"
            >
              Sort by {selectedOption}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <SortDropdown
              setSelectedOption={handleSortChange}
              sortOptions={sortOptions}
            />
          </div>

          <div className="dropdown w-full md:w-[110px] ">
            <div
              tabIndex={0}
              role="button"
              className="btn w-full justify-between text-left truncate"
            >
              Show {selectedItems}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <ItemsDropdown
              setSelectedItems={handleItemsChange}
              ItemsShowOptions={ItemsShowOptions}
            />
          </div>
        </div>
      </div>

      {/* Book grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getPaginatedBooks()}
      </div>

      {/* Pagination */}
      <div className="flex justify-center p-4">
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
        </div>
      </div>
    </section>
  );
};

export default BooksGrid;
