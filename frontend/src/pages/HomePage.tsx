import FeaturedBooks from "../components/FeaturedBooks";
import MainLayout from "../components/layout/MainLayout";
import OnSale from "../components/OnSale";

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
