import AddtoCart from "../components/AddToCart";
import BookDetails from "../components/BookDetails";
import CustomerReviews from "../components/CustomerReviews";

const ProductPage = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold py-6 border-b border-gray-300 mx-18 mb-4">
        Category Name
      </h2>
      <div className="flex flex-col lg:flex-row mx-18 gap-8">
        {/* Book Details */}
        <div className="w-full lg:w-7/10">
          <BookDetails></BookDetails>
        </div>

        {/* Add To Cart */}
        <aside className="w-full lg:w-3/10">
          <AddtoCart></AddtoCart>
        </aside>
      </div>
      <div className="flex flex-col lg:flex-row mx-18 gap-8 mt-8">
        {/* Book Details */}
        <div className="w-full lg:w-7/10">
          <CustomerReviews></CustomerReviews>
        </div>

        {/* Add To Cart */}
        <aside className="w-full lg:w-3/10">
          <AddtoCart></AddtoCart>
        </aside>
      </div>
    </>
  );
};
export default ProductPage;
