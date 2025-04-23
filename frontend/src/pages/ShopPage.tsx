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
