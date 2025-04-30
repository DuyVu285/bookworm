import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import authorService from "../../services/authorService";

interface ActiveFilters {
  [key: string]: string | undefined;
}

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const ratings = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchAuthors = async () => {
      const authors = await authorService.get_all_authors();
      console.log(authors);
    };

    fetchAuthors();
  }, []);

  // Initialize filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => ({
    Category: searchParams.get("Category") ?? undefined,
    Author: searchParams.get("Author") ?? undefined,
    Rating: searchParams.get("Rating") ?? undefined,
  }));

  const updateSearchParams = (filters: ActiveFilters) => {
    const newParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    setSearchParams(newParams);
  };

  const handleClick = (type: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (newFilters[type] === value) {
        delete newFilters[type];
      } else {
        newFilters[type] = value;
      }

      updateSearchParams(newFilters);
      return newFilters;
    });
  };

  const renderFilterButtons = (type: string, items: string[]) =>
    items.map((label) => (
      <button
        key={label}
        type="button"
        onClick={() => handleClick(type, label)}
        className={`btn flex justify-start text-left ${
          activeFilters[type] === label
            ? "btn-active bg-gray-400"
            : "bg-base-100 border-none"
        }`}
        aria-pressed={activeFilters[type] === label}
      >
        {label} {type === "Rating" ? "Star" : ""}
      </button>
    ));

  return (
    <div className="p-2">
      <h2 className="text-2xl font-semibold pb-2">Filters By</h2>

      <div className="flex flex-col gap-2">
        <div className="collapse bg-base-100 border border-base-400">
          <input type="checkbox" name="accordion-category" defaultChecked />
          <div className="collapse-title font-semibold text-2xl">Category</div>
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
            {renderFilterButtons("Rating", ratings.map(String))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
