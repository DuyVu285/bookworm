import AddtoCart from "../sections/ProductSection/AddToCart";
import BookDetails from "../sections/ProductSection/BookDetails";
import CustomerReviews from "../sections/ProductSection/CustomerReviews";
import MainLayout from "../layout/MainLayout";
import WriteAReview from "../sections/ProductSection/WriteAReview";
import bookService from "../services/api/bookService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Book = {
  book_title?: string;
  book_price?: number;
  book_summary?: string;
  book_cover_photo?: string;
  author_name?: string;
  category_name?: string;
};

type BookCart = {
  id: number;
  book_title?: string;
  book_price?: number;
  sub_price?: number;
  book_cover_photo?: string;
  author_name?: string;
};

const ProductPage = () => {
  const [bookDetails, setBookDetails] = useState<Book | null>(null);
  const [bookCart, setBookCart] = useState<BookCart>();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBookDetails = async () => {
        try {
          const response = await bookService.getBookById(Number(id));
          const book: Book = {
            book_title: response.book_title,
            book_price: response.book_price,
            book_summary: response.book_summary,
            book_cover_photo: response.book_cover_photo,
            author_name: response.author_name,
            category_name: response.category_name,
          };
          const bookCart: BookCart = {
            id: Number(id),
            book_title: response.book_title,
            book_price: response.book_price,
            sub_price: response.sub_price,
            book_cover_photo: response.book_cover_photo,
            author_name: response.author_name,
          };
          setBookDetails(book);
          setBookCart(bookCart);
        } catch (error) {
          console.error("Failed to fetch book details", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookDetails();
    }
  }, [id]);

  return (
    <MainLayout type={bookDetails?.category_name}>
      <div className="flex flex-col lg:flex-row mx-18 gap-8">
        {/* Book Details */}
        <div className="w-full lg:w-7/10">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-xl"></span>
              <span className="text-2xl p-2">Loading</span>
            </div>
          ) : (
            <>{bookDetails && <BookDetails book={bookDetails} />}</>
          )}
        </div>

        {/* Add To Cart */}
        <aside className="w-full lg:w-3/10">
          {bookCart && <AddtoCart bookCart={bookCart} />}
        </aside>
      </div>
      <div className="flex flex-col lg:flex-row mx-18 gap-8 my-8 ">
        {/* Customer Reviews */}
        <div className="w-full lg:w-7/10 mb-6">
          <CustomerReviews
            book_id={Number(id)}
            refreshTrigger={refreshReviews}
          />
        </div>

        {/* Write a Review */}
        <aside className="w-full lg:w-3/10">
          <WriteAReview
            book_id={Number(id)}
            onReviewSubmitted={() => setRefreshReviews((prev) => !prev)}
          />
        </aside>
      </div>
    </MainLayout>
  );
};

export default ProductPage;
