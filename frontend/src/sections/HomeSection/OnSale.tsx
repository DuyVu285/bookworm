import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard";
import bookService from "../../services/api/bookService";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  author_name: string;
  sub_price: number;
};

const OnSale = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop10Books() {
      try {
        const response = await bookService.getTop10MostDiscountedBooks();
        setBooks(response);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTop10Books();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center pb-2 px-2">
        <h2 className="text-3xl font-semibold">On Sale</h2>
        <Link
          to="/Shop?page=1&sort=on+sale&limit=20"
          className="btn btn-lg text-white text-xl bg-gray-500 rounded-lg"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
          </svg>
        </Link>
      </div>

      <div className="rounded-box border border-gray-300 py-8 px-4 relative flex justify-center items-center min-h-[300px] w-full">
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <span className="loading loading-spinner loading-xl"></span>
            <span className="text-2xl p-2">Loading</span>
          </div>
        ) : (
          <>
            {/* Left Button (Visible only on larger screens) */}
            <div className="cursor-pointer custom-prev-button hidden sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                className="bi bi-caret-left"
                viewBox="0 0 16 16"
              >
                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
              </svg>
            </div>

            {/* Swiper */}
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".custom-prev-button",
                nextEl: ".custom-next-button",
              }}
              loop={true}
              spaceBetween={8}
              slidesPerView={"auto"}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
            >
              {books.map((book) => (
                <SwiperSlide key={book.id}>
                  <BookCard {...book} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Right Button (Visible only on larger screens) */}
            <div className="cursor-pointer custom-next-button hidden sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                className="bi bi-caret-right"
                viewBox="0 0 16 16"
              >
                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
              </svg>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OnSale;
