import { useState } from "react";
import BooksGrid from "../sections/ShopSection/BooksGrid";
import Filters from "../sections/ShopSection/Filters";
import MainLayout from "../components/layout/MainLayout";

type FilterType = "Books";
type FilterValue = string | number;

interface ActiveFilter {
  type: FilterType;
  value: FilterValue;
}

const ShopPage = () => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | undefined>(
    undefined
  );

  const handleFilterChange = (type?: FilterType, value?: FilterValue) => {
    if (type && value !== undefined) {
      setActiveFilter({ type, value });
    } else {
      setActiveFilter(undefined);
    }
  };

  return (
    <MainLayout type="Books">
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
    </MainLayout>
  );
};

export default ShopPage;
