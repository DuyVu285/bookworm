import BooksGrid from "../sections/ShopSection/BooksGrid";
import Filters from "../sections/ShopSection/Filters";
import MainLayout from "../components/layout/MainLayout";
import { FILTER_KEYS, useQueryFilters } from "../hooks/useQueryFilters";
import categoryService from "../services/categoryService";
import { useEffect, useState } from "react";
import authorService from "../services/authorService";

const ShopPage = () => {
  const { getParam } = useQueryFilters();

  const categoryId = getParam(FILTER_KEYS.CATEGORY);
  const authorId = getParam(FILTER_KEYS.AUTHOR);
  const rating = getParam(FILTER_KEYS.RATING);

  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  useEffect(() => {
    async function fetchCategoryById() {
      if (categoryId) {
        const response = await categoryService.get_category_by_id(
          Number(categoryId)
        );
        setCategory(response.category_name);
      }
    }

    async function fetchAuthorById() {
      if (authorId) {
        const response = await authorService.get_author_by_id(Number(authorId));
        setAuthor(response.author_name);
      }
    }
    fetchAuthorById();
    fetchCategoryById();
  }, [categoryId, authorId]);

  console.log("Category name:", category);
  console.log("Author name:", author);

  const displayString = `${category || ""}, ${author || ""}, ${
    rating ? `${rating} Star` : ""
  }`.trim();
  console.log("Display String:", displayString);

  return (
    <MainLayout type="Books" value={displayString}>
      <div className="flex flex-col lg:flex-row mx-18">
        {/* Aside Filters */}
        <aside className="w-full lg:w-1/6">
          <Filters />
        </aside>

        {/* Book Grid */}
        <div className="w-full lg:w-5/6">
          <BooksGrid />
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
