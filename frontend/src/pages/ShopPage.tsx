import { useEffect, useState } from "react";
import BooksGrid from "../sections/ShopSection/BooksGrid";
import Filters from "../sections/ShopSection/Filters";
import MainLayout from "../components/layout/MainLayout";
import { FILTER_KEYS, useQueryFilters } from "../hooks/useQueryFilters";
import categoryService from "../services/api/categoryService";
import authorService from "../services/api/authorService";

const ShopPage = () => {
  const { getParam } = useQueryFilters();

  const [category, setCategory] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [rating, setRating] = useState<string | null>(null);

  useEffect(() => {
    const categoryId = getParam(FILTER_KEYS.CATEGORY);
    const authorId = getParam(FILTER_KEYS.AUTHOR);
    const rating = getParam(FILTER_KEYS.RATING);

    // Fetch category
    async function fetchCategoryById() {
      try {
        if (categoryId) {
          const response = await categoryService.get_category_by_id(
            Number(categoryId)
          );
          setCategory(response.category_name);
        } else {
          setCategory(null);
        }
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    }

    // Fetch author
    async function fetchAuthorById() {
      try {
        if (authorId) {
          const response = await authorService.get_author_by_id(
            Number(authorId)
          );
          setAuthor(response.author_name);
        } else {
          setAuthor(null);
        }
      } catch (error) {
        console.error("Failed to fetch author", error);
      }
    }

    setRating(rating || null);

    fetchCategoryById();
    fetchAuthorById();
  }, [getParam]);

  // Conditionally build the display string
  const parts: string[] = [];
  if (category) parts.push(category);
  if (author) parts.push(author);
  if (rating) parts.push(`${rating} star`);

  // Join parts with commas, but only if parts exist
  const displayString = parts.join(", ");

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
