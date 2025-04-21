const OnSale = () => {
  const images = [
    "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
  ];

  const createSlides = () => {
    const slideCount = Math.ceil(images.length / 4);
    let slides = [];

    for (let i = 0; i < slideCount; i++) {
      const slideImages = images.slice(i * 4, (i + 1) * 4);

      slides.push(
        <div
          key={i}
          id={`slide${i + 1}`}
          className="carousel-item relative w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {slideImages.map((img, index) => (
              <img key={index} src={img} className="w-full" />
            ))}
          </div>
        </div>
      );
    }
    return slides;
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
      <div className="border border-gray-400 relative flex flex-row items-center">
        {/* Left Button */}
        <button className="btn btn-circle">❮</button>
        <div className="carousel w-full p-4">{createSlides()}</div>
        {/* Right Button */}
        <button className="btn btn-circle">❯</button>
      </div>
    </section>
  );
};

export default OnSale;
