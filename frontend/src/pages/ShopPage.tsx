import { useState } from "react";
import BooksGrid from "../components/BooksGrid";
import Breadcrumbs from "../components/Breadcrumbs";
import Filters from "../components/Filters";

type FilterType = "Books";
type FilterValue = string | number;

interface ActiveFilter {
  type: FilterType;
  value: FilterValue;
}

const ShopPage = () => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | undefined>(undefined);

  const handleFilterChange = (type?: FilterType, value?: FilterValue) => {
    if (type && value !== undefined) {
      setActiveFilter({ type, value });
    } else {
      setActiveFilter(undefined);
    }
  };

  return (
    <main>
      {/* Breadcrumbs */}
      <div className="py-6 border-b border-gray-300 mx-18">
        <Breadcrumbs selectedFilter={activeFilter} />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row mx-18">
        {/* Aside Filters */}
        <aside className="w-full lg:w-1/4">
          <Filters onFilterChange={handleFilterChange} />
        </aside>

        {/* Book Grid */}
        <div className="w-full lg:w-3/4">
          <BooksGrid />
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
