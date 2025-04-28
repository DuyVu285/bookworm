import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard";
import bookService from "../../services/bookService";

type Book = {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  author_name: string;
  sub_price: number;
};

const FeaturedBooks = () => {
  const [selectedTab, setSelectedTab] = useState<"recommended" | "popular">(
    "recommended"
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    async function fetchTop8Books(sort: string) {
      try {
        const response = await bookService.getTop8Books(sort);
        setBooks(response);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTop8Books(sort);
  }, [sort]);

  return (
    <>
      <div className="flex flex-col items-center pb-2 px-2">
        <h2 className="text-3xl font-semibold text-center">Featured Books</h2>
        <div className="pt-2 w-full flex justify-center">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("recommended")}
              className={`btn btn-lg font-semibold ${
                selectedTab === "recommended"
                  ? "bg-gray-300 text-white"
                  : "bg-transparent border-none text-black "
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setSelectedTab("popular")}
              className={`btn btn-lg font-semibold ${
                selectedTab === "popular"
                  ? "bg-gray-300 text-white"
                  : "bg-transparent border-none text-black "
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between py-4 px-8 border border-gray-300">
        <div className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-18">
        </div>
      </div>
    </>
  );
};

export default FeaturedBooks;
