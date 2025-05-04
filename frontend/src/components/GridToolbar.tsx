import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FILTER_KEYS, useQueryFilters } from "../hooks/useQueryFilters";

type SortOption = {
  key: string;
  label: string;
};

type GridToolbarProps = {
  sortOptions: SortOption[];
  startItem: number;
  endItem: number;
  totalItems: number;
  itemType: string;
  initialItemsPerPage: number;
  initialSortOption: string;
};

const GridToolbar = ({
  sortOptions,
  startItem,
  endItem,
  totalItems,
  itemType,
  initialItemsPerPage,
}: GridToolbarProps) => {
  const { getParam, updateParams } = useQueryFilters();
  const searchParams = useSearchParams();
  const itemsShowOptions = [5, 15, 20, 25];
  const [selectedOption, setSelectedOption] = useState(sortOptions[0].key);
  const [selectedItems, setSelectedItems] = useState(initialItemsPerPage);

  useEffect(() => {
    const initialSort = getParam(FILTER_KEYS.SORT) || sortOptions[0]?.key || "";
    const initialLimit = parseInt(
      getParam(FILTER_KEYS.LIMIT) || String(initialItemsPerPage),
      10
    );
    if (initialSort !== selectedOption) setSelectedOption(initialSort);
    if (initialLimit !== selectedItems) setSelectedItems(initialLimit);
  }, [searchParams, selectedOption, selectedItems]);

  const handleSortChange = (option: string) => {
    updateParams({ [FILTER_KEYS.SORT]: option }, FILTER_KEYS.PAGE);
    setSelectedOption(option);
  };

  const handleItemsChange = (count: number) => {
    updateParams({ [FILTER_KEYS.LIMIT]: count.toString() }, FILTER_KEYS.PAGE);
    setSelectedItems(count);
  };

  const SortDropdown = ({
    sortOptions,
    setSelectedOption,
  }: {
    sortOptions: SortOption[];
    setSelectedOption: (option: string) => void;
  }) => (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
    >
      {sortOptions.map(({ key, label }, index) => (
        <li key={index}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOption(key);
            }}
          >
            Sort by {label}
          </a>
        </li>
      ))}
    </ul>
  );

  const ItemsDropdown = ({
    itemsShowOptions,
    setSelectedItems,
  }: {
    itemsShowOptions: number[];
    setSelectedItems: (option: number) => void;
  }) => (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
    >
      {itemsShowOptions.map((option, index) => (
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

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h3 className="text-2xl">
        Showing {startItem}-{endItem} of {totalItems} {itemType}
      </h3>

      <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-4">
        <div
          className="dropdown w-full md:max-w-[16rem]
"
        >
          <div
            tabIndex={0}
            role="button"
            className="btn w-full justify-between text-left truncate text-white bg-gray-500"
          >
            Sort by{" "}
            {sortOptions.find((opt) => opt.key === selectedOption)?.label ??
              selectedOption}
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

        <div className="dropdown w-full md:max-w-[7rem]">
          <div
            tabIndex={0}
            role="button"
            className="btn w-full justify-between text-left truncate text-white bg-gray-500"
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
            setSelectedItems={(count) => {
              handleItemsChange(count);
            }}
            itemsShowOptions={itemsShowOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default GridToolbar;
