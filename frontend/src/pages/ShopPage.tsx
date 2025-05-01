import BooksGrid from "../sections/ShopSection/BooksGrid";
import Filters from "../sections/ShopSection/Filters";
import MainLayout from "../components/layout/MainLayout";

const ShopPage = () => {
  return (
    <MainLayout type="Books">
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
