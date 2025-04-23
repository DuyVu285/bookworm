import { useState } from "react";

const Filters = () => {
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const authors = ["Author 1", "Author 2", "Author 3", "Author 4"];
  const ratings = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleClick = (value: string) => {
    setActiveFilter((prev) => (prev === value ? null : value));
  };

  return (
    <section className="mx-18">
      <h2 className="text-2xl font-semibold pb-2">Filters By</h2>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="checkbox" name="accordion-category" defaultChecked />
        <div className="collapse-title font-semibold text-2xl">Category</div>
        <div className="collapse-content text-sm flex flex-col gap-2">
          {categories.map((label) => (
              <button
              key={label}
              type="button"
              onClick={() => handleClick(label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter === label ? "btn-active bg-gray-400 btn" : ""
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
              onClick={() => handleClick(label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter === label ? "btn-active bg-gray-400 btn" : ""
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
              onClick={() => handleClick(label)}
              className={`btn btn-none bg-base-100 border-none flex justify-start text-left${
                activeFilter === label ? "btn-active bg-gray-400 btn" : ""
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
