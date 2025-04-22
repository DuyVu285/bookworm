import { useState } from "react";
import BookCard from "./BookCard";

const FeaturedBooks = () => {
  const [selectedTab, setSelectedTab] = useState<"recommended" | "popular">(
    "recommended"
  );

  const createBooksGrid = (type: "recommended" | "popular") => {
    const numberOfBooks = 8;

    const cards = Array.from({ length: numberOfBooks }, (_, i) => (
      <BookCard key={`${type}-${i}`} />
    ));

    return cards.map((card, index) => (
      <div key={index} className="w-full shrink-0">
        {card}
      </div>
    ));
  };

  return (
    <section className="mx-14 my-8">
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

      <div className="relative flex items-center justify-between py-4 px-8 border border-gray-400">
        <div className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-18">
          {createBooksGrid(selectedTab)}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
