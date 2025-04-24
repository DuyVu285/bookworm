import { useState } from "react";

type FilterType = "Books";
type FilterValue = string;

interface ActiveFilter {
  type: FilterType;
  value: FilterValue;
}

const Filters = ({
  onFilterChange,
}: {
  onFilterChange: (type?: FilterType, value?: FilterValue) => void;
}) => {
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const authors = ["Author 1", "Author 2", "Author 3", "Author 4"];
  const ratings = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];

  const [activeFilter, setActiveFilter] = useState<ActiveFilter | undefined>();

  const handleClick = (type: FilterType, value: FilterValue) => {
    if (activeFilter?.type === type && activeFilter.value === value) {
      setActiveFilter(undefined);
      onFilterChange(); // clear filter
    } else {
      setActiveFilter({ type, value });
      onFilterChange(type, value);
    }
  };

  const renderFilterButtons = (type: FilterType, items: string[]) =>
    items.map((label) => (
      <button
        key={label}
        type="button"
        onClick={() => handleClick(type, label)}
        className={`btn btn-none bg-base-100 border-none flex justify-start text-left ${
          activeFilter?.type === type && activeFilter.value === label
            ? "btn-active bg-gray-400 btn"
            : ""
        }`}
      >
        {label}
      </button>
    ));

  return (
    <section className="p-2">
      <h2 className="text-2xl font-semibold pb-2">Filters By</h2>

      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-category" defaultChecked />
        <div className="collapse-title font-semibold text-2xl">Category</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {renderFilterButtons("Books", categories)}
        </div>
      </div>

      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-author" />
        <div className="collapse-title font-semibold text-2xl">Author</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {renderFilterButtons("Books", authors)}
        </div>
      </div>

      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-rating" />
        <div className="collapse-title font-semibold text-2xl">Rating Review</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {renderFilterButtons("Books", ratings)}
        </div>
      </div>
    </section>
  );
};

export default Filters;
