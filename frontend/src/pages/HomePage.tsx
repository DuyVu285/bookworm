import FeaturedBooks from "../sections/HomeSection/FeaturedBooks";
import MainLayout from "../layout/MainLayout";
import OnSale from "../sections/HomeSection/OnSale";

const HomePage = () => {
  return (
    <MainLayout>
      {/* On Sale Section */}
      <div className="mx-4 sm:mx-10 md:mx-24 my-6 sm:my-8 md:my-10">
        <OnSale />
      </div>

      {/* Featured Books Section */}
      <div className="mx-4 sm:mx-10 md:mx-24 my-6 sm:my-8 md:my-10">
        <FeaturedBooks />
      </div>
    </MainLayout>
  );
};

export default HomePage;
