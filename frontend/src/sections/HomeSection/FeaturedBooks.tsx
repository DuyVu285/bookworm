import { useEffect, useState } from "react";
import bookService from "../../services/bookService";
import BookGridDisplay from "../../components/BookGridDisplay"; // Import the reusable component

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
      setLoading(true);
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

  const handleTabChange = (tab: "recommended" | "popular") => {
    setSelectedTab(tab);
    setSort(tab);
  };

  return (
    <>
      <div className="flex flex-col justify-between items-center pb-2 px-2">
        <h2 className="text-3xl font-semibold">Featured Books</h2>
        <div className="pt-4 w-full flex justify-center">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange("recommended")}
              className={`btn btn-lg font-semibold ${
                selectedTab === "recommended"
                  ? "bg-gray-300 text-white"
                  : "bg-transparent border-none text-black "
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => handleTabChange("popular")}
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

      <BookGridDisplay
        books={books}
        loading={loading}
        columns={{ sm: 1, md: 2, lg: 4 }}
      />
    </>
  );
};

export default FeaturedBooks;
