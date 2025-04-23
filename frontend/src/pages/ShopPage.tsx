import BooksGrid from "../components/BooksGrid";
import Breadcrumbs from "../components/Breadcrumbs";
import Filters from "../components/Filters";

const ShopPage = () => {
  return (
    <main>
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Aside Filters */}
        <aside className="w-full lg:w-1/4">
          <Filters />
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
