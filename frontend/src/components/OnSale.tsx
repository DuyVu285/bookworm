import { useRef } from "react";
import BookCard from "./BookCard";

const OnSale = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollBySlide = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: direction === "right" ? width : -width,
        behavior: "smooth",
      });
    }
  };

  const createSlides = () => {
    const cards = Array.from({ length: 7 }, (_, i) => <BookCard key={i} />);

    const groups = [];
    for (let i = 0; i < cards.length; i += 4) {
      groups.push(cards.slice(i, i + 4));
    }

    return groups.map((group, index) => (
      <div key={index} className="carousel-item w-full shrink-0 justify-center">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {group}
        </div>
      </div>
    ));
  };

  return (
    <section className="mx-14 my-6">
      <div className="flex justify-between items-center pb-2 px-2">
        <h2 className="text-3xl font-semibold">On Sale</h2>
        <button className="btn btn-lg text-white text-xl bg-gray-500">
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
        </button>
      </div>

      <div className="relative flex items-center justify-between py-4 px-8 border border-gray-400">
        {/* Left Button */}
        <button
          className="btn btn-circle"
          onClick={() => scrollBySlide("left")}
        >
          ❮
        </button>

        <div
          ref={carouselRef}
          className="carousel w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {createSlides()}
        </div>

        {/* Right Button */}
        <button
          className="btn btn-circle"
          onClick={() => scrollBySlide("right")}
        >
          ❯
        </button>
      </div>
    </section>
  );
};

export default OnSale;
