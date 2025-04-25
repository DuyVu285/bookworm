import FeaturedBooks from "../components/FeaturedBooks";
import MainLayout from "../components/layout/MainLayout";
import OnSale from "../components/OnSale";

const HomePage = () => {
  return (
    <MainLayout>
      <OnSale />
      <FeaturedBooks />
    </MainLayout>
  );
};

export default HomePage;
