import { useEffect, useState } from "react";

type FilterType = "Category" | "Author" | "Rating";
type FilterValue = string;

interface ActiveFilters {
  [key: string]: FilterValue | undefined; // A map of filter type to selected filter value
}

const Filters = ({
  onFilterChange,
}: {
  onFilterChange: (filters: ActiveFilters) => void;
}) => {
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const authors = ["Author 1", "Author 2", "Author 3", "Author 4"];
  const ratings = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];


  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const handleClick = (type: FilterType, value: FilterValue) => {
    const newFilters = { ...activeFilters };

    // If the value is already selected, we remove the filter (i.e., unselect it)
    if (newFilters[type] === value) {
      newFilters[type] = undefined;
    } else {
      newFilters[type] = value;
    }

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderFilterButtons = (type: FilterType, items: string[]) =>
    items.map((label) => (
      <button
        key={label}
        type="button"
        onClick={() => handleClick(type, label)}
        className={`btn btn-none bg-base-100 border-none flex justify-start text-left ${
          activeFilters[type] === label ? "btn-active bg-gray-400 btn" : ""
        }`}
      >
        {label}
      </button>
    ));

  return (
    <>
      <div className="p-2">
        <h2 className="text-2xl font-semibold pb-2">Filters By</h2>

        <div className="flex flex-col gap-2">
          <div className="collapse bg-base-100 border border-base-400">
            <input type="checkbox" name="accordion-category" defaultChecked />
            <div className="collapse-title font-semibold text-2xl">
              Category
            </div>
            <div className="collapse-content text-sm flex flex-col gap-2">
              {renderFilterButtons("Category", categories)}
            </div>
          </div>

          <div className="collapse bg-base-100 border border-base-400">
            <input type="checkbox" name="accordion-author" />
            <div className="collapse-title font-semibold text-2xl">Author</div>
            <div className="collapse-content text-sm flex flex-col gap-2">
              {renderFilterButtons("Author", authors)}
            </div>
          </div>

          <div className="collapse bg-base-100 border border-base-400">
            <input type="checkbox" name="accordion-rating" />
            <div className="collapse-title font-semibold text-2xl">
              Rating Review
            </div>
            <div className="collapse-content text-sm flex flex-col gap-2">
              {renderFilterButtons("Rating", ratings)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
