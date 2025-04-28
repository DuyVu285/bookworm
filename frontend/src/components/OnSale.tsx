import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import bookService from "../services/bookService";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";

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

  if (loading) {
    return (
      <div>
        <span className="loading loading-spinner loading-xl">
          Loading<span className="loading loading-dots loading-xl"></span>
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center pb-2 px-2">
        <h2 className="text-3xl font-semibold">On Sale</h2>
        <a href="/Shop" className="btn btn-lg text-white text-xl bg-gray-500 ">
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </div>

      <div className="border p-8 relative flex items-center ">
        {/* Left Button */}
        <div className="cursor-pointer custom-next-button p-2 text-4xl mr-4 hidden sm:block">
          ◀
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".custom-prev-button",
            nextEl: ".custom-next-button",
          }}
          loop={true}
          spaceBetween={20}
          slidesPerView={"auto"}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 50 },
          }}
          className="flex"
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <BookCard {...book} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Button */}
        <div className="cursor-pointer custom-next-button p-2 text-4xl ml-4 hidden sm:block">
          ▶
        </div>
      </div>
    </>
  );
};

export default OnSale;
