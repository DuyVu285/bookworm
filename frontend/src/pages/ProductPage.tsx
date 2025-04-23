import AddtoCart from "../components/AddToCart";
import BookDetails from "../components/BookDetails";

const ProductPage = () => {
  return (
    <main>
      <h2 className="text-2xl font-semibold py-6 border-b border-gray-300 mx-18 mb-4">
        Category Name
      </h2>
      <div className="flex flex-col lg:flex-row mx-18 gap-8">
        {/* Aside Filters */}
        <aside className="w-full lg:w-7/10">
          <BookDetails></BookDetails>
        </aside>

        {/* Book Grid */}
        <div className="w-full lg:w-3/10">
          <AddtoCart></AddtoCart>
        </div>
      </div>
    </main>
  );
};
export default ProductPage;
