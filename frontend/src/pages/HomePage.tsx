import FeaturedBooks from "../sections/HomeSection/FeaturedBooks";
import MainLayout from "../components/layout/MainLayout";
import OnSale from "../sections/HomeSection/OnSale";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="mx-24 my-8">
        <OnSale />
      </div>
      <div className="mx-24 my-8">
        <FeaturedBooks />
      </div>
    </MainLayout>
  );
};

export default HomePage;
