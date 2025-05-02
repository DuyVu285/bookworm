import { useEffect, useState } from "react";
import authorService from "../../services/authorService";
import categoryService from "../../services/categoryService";
import { useQueryFilters } from "../../hooks/useQueryFilters";

const Filters = () => {
  const { getParam, updateParams } = useQueryFilters();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const ratings = [1, 2, 3, 4, 5];

  // Fetch authors and categories on component mount
  useEffect(() => {
    const fetchAuthors = async () => {
      const authors = await authorService.get_all_authors();
      setAuthors(
        authors.map((author) => ({ id: author.id, name: author.author_name }))
      );
    };

    const fetchCategories = async () => {
      const response = await categoryService.get_all_categories();
      setCategories(
        response.map((category) => ({
          id: category.id,
          name: category.category_name,
        }))
      );
    };

    fetchAuthors();
    fetchCategories();
  }, []);

  // Update search parameters with active filters
  const handleFilterClick = (type: string, id: number) => {
    const stringId = id.toString();
    const current = getParam(type);
    updateParams(
      { [type]: current === stringId ? undefined : stringId },
      "page"
    );
  };

  // Render filter buttons for categories, authors, or ratings
  const renderFilterButtons = (
    type: string,
    items: { id: number; name: string }[]
  ) =>
    items.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => handleFilterClick(type, item.id)}
        className={`btn flex justify-start text-left ${
          getParam(type) === item.id.toString()
            ? "btn-active bg-gray-400"
            : "bg-base-100 border-none"
        }`}
        aria-pressed={getParam(type) === item.id.toString()}
      >
        {item.name} {type === "Rating" ? "Star" : ""}
      </button>
    ));

  return (
    <div className="p-2">
      <h2 className="text-2xl font-semibold pb-2">Filters By</h2>

      <div className="flex flex-col gap-2">
        {/* Category Filter */}
        <div className="collapse bg-base-100 border border-base-400">
          <input type="checkbox" name="accordion-category" defaultChecked />
          <div className="collapse-title font-semibold text-2xl">Category</div>
          <div className="collapse-content text-sm flex flex-col gap-2">
            {renderFilterButtons("Category", categories)}
          </div>
        </div>

        {/* Author Filter */}
        <div className="collapse bg-base-100 border border-base-400">
          <input type="checkbox" name="accordion-author" defaultChecked />
          <div className="collapse-title font-semibold text-2xl">Author</div>
          <div className="collapse-content text-sm flex flex-col gap-2">
            {renderFilterButtons("Author", authors)}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="collapse bg-base-100 border border-base-400">
          <input type="checkbox" name="accordion-rating" defaultChecked />
          <div className="collapse-title font-semibold text-2xl">
            Rating Review
          </div>
          <div className="collapse-content text-sm flex flex-col gap-2">
            {renderFilterButtons(
              "Rating",
              ratings.map((rating) => ({ id: rating, name: rating.toString() }))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
