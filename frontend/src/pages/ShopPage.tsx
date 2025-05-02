import BooksGrid from "../sections/ShopSection/BooksGrid";
import Filters from "../sections/ShopSection/Filters";
import MainLayout from "../components/layout/MainLayout";
import { FILTER_KEYS, useQueryFilters } from "../hooks/useQueryFilters";

const ShopPage = () => {
  const { getParam } = useQueryFilters();

  const category = getParam(FILTER_KEYS.CATEGORY);
  const author = getParam(FILTER_KEYS.AUTHOR);
  const rating = getParam(FILTER_KEYS.RATING);

  const filters = [category, author, rating].filter(Boolean);
  const displayString = filters.length > 0 ? `${filters.join(", ")}` : "";

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
