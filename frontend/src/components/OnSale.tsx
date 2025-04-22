import { useRef } from "react";

const OnSale = () => {
  const images = [
    "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
  ];

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
    const groups: string[][] = [];
    for (let i = 0; i < images.length; i += 4) {
      groups.push(images.slice(i, i + 4));
    }

    return groups.map((group, i) => (
      <div key={i} className="carousel-item w-full shrink-0 snap-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-2">
          {group.map((img, idx) => (
            <img key={idx} src={img} className="w-full" />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <section className="mx-10 my-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">On Sale</h2>
        <button className="btn btn-sm text-white bg-gray-500">
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

      <div className="border border-gray-400 relative flex items-center p-4">
        {/* Left Button */}
        <button className="btn btn-circle z-10" onClick={() => scrollBySlide("left")}>
          ❮
        </button>

        <div
          ref={carouselRef}
          className="carousel carousel-center space-x-4 w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {createSlides()}
        </div>

        {/* Right Button */}
        <button className="btn btn-circle z-10" onClick={() => scrollBySlide("right")}>
          ❯
        </button>
      </div>
    </section>
  );
};

export default OnSale;
