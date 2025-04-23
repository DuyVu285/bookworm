import { useState } from "react";
import BooksGrid from "../components/BooksGrid";
import Breadcrumbs from "../components/Breadcrumbs";
import Filters from "../components/Filters";

const ShopPage = () => {
  const [activeFilter, setActiveFilter] = useState<{
    type: string | null;
    value: string | null;
  }>({
    type: null,
    value: null,
  });

  const handleFilterChange = (type: string | null, value: string | null) => {
    setActiveFilter({ type, value });
  };
  return (
    <main>
      {/* Breadcrumbs */}
      <Breadcrumbs selectedFilter={activeFilter} />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row pt-4 border-t border-gray-300 mx-18">
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
