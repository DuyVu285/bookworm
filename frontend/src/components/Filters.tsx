import { useState } from "react";

const Filters = ({
  onFilterChange,
}: {
  onFilterChange: (type: string | null, value: string | null) => void;
}) => {
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const authors = ["Author 1", "Author 2", "Author 3", "Author 4"];
  const ratings = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];
  const [activeFilter, setActiveFilter] = useState<{
    type: string | null;
    value: string | null;
  }>({
    type: null,
    value: null,
  });

  const handleClick = (type: string, value: string) => {
    if (activeFilter.type === type && activeFilter.value === value) {
      setActiveFilter({ type: null, value: null });
      onFilterChange(null, null);
    } else {
      setActiveFilter({ type, value });
      onFilterChange(type, value);
    }
  };

  return (
    <section className="p-2">
      <h2 className="text-2xl font-semibold pb-2">Filters By</h2>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-category" defaultChecked />
        <div className="collapse-title font-semibold text-2xl">Category</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {categories.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleClick("category", label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter.type === "category" && activeFilter.value === label
                  ? "btn-active bg-gray-400 btn"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-author" />
        <div className="collapse-title font-semibold text-2xl">Author</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {authors.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleClick("author", label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter.type === "category" && activeFilter.value === label
                  ? "btn-active bg-gray-400 btn"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-rating" />
        <div className="collapse-title font-semibold text-2xl">
          Rating Review{" "}
        </div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {ratings.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleClick("rating", label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter.type === "category" && activeFilter.value === label
                  ? "btn-active bg-gray-400 btn"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Filters;
