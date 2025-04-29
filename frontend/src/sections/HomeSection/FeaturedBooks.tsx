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

      <div className="border border-gray-400 p-8 relative flex items-center min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <span className="loading loading-spinner loading-xl"></span>
            <span className="text-2xl p-2">Loading</span>
          </div>
        ) : (
          <>
            <div className="items-center w-full grid md:grid-cols-1 lg:grid-cols-4 gap-4 pr-18 pl-25 ">
              {books.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FeaturedBooks;
