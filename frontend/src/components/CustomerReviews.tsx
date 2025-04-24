import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";

const CustomerReviews = () => {
  const ratings = [1, 2, 3, 4, 5];
  const [selectedRating, setSelectedRating] = useState(ratings[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 3
  return (
    <>
      <div className="border border-gray-300 p-8">
        <Breadcrumbs
          selectedFilter={{ type: "Customer Reviews", value: selectedRating }}
        />
        <div>
          {/* Customer Ratings */}
          <div className="py-8">
            <span className="text-5xl font-bold">4.6 Star</span>
            <div className="flex flex-row  pt-2 cursor-pointer text-xl gap-2">
              <span className=" font-semibold text-decoration-line: underline hover:text-blue-800 hover:underline">
                (3132)
              </span>{" "}
              {/* Total Number of Reviews */}
              <div className="pl-4">
                {ratings.map((rating, index) => (
                  <span
                    key={rating}
                    className={` ${
                      selectedRating === rating ? "btn-active" : ""
                    }`}
                    onClick={() => setSelectedRating(rating)}
                  >
                    <span className="text-decoration-line: underline">
                      {rating} star (number)
                    </span>
                    {index != ratings.length - 1 ? " | " : ""}
                  </span> /* Ratings */
                ))}
              </div>
            </div>
            <div className="pt-4 text-xl flex flex-row justify-between">
              <span>Showing 1-12 of 3132 reviews</span>
              <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-4">
                <div className="dropdown w-full md:w-[220px]">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn w-full justify-between text-left truncate"
                  >
                    Sort by
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>

                <div className="dropdown w-full md:w-[110px] ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn w-full justify-between text-left truncate"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <ul className="list bg-base-100 rounded-box shadow-md gap-4">
              <li className="list-row-wrap">
                <div className=" text-3xl font-semibold pb-4">
                  Review Title
                  <span className=" text-xl font-light"> | 5 stars</span>
                </div>
                <p className="text-xl pb-4">
                  "Remaining Reason" became an instant hit, praised for its
                  haunting sound and emotional depth. A viral performance
                  brought it widespread recognition, making it one of Dio Lupa’s
                  most iconic tracks.
                </p>
                <span className="text-xl">Month Date, Year</span>
                <div className="border-b border-gray-300 mt-4"></div>
              </li>
              <li className="list-row-wrap">
                <div className=" text-3xl font-semibold pb-4">
                  Review Title
                  <span className=" text-xl font-light"> | 5 stars</span>
                </div>
                <p className="text-xl pb-4">
                  "Remaining Reason" became an instant hit, praised for its
                  haunting sound and emotional depth. A viral performance
                  brought it widespread recognition, making it one of Dio Lupa’s
                  most iconic tracks.
                </p>
                <span className="text-xl">Month Date, Year</span>
                <div className="border-b border-gray-300 mt-4"></div>
              </li>
              <li className="list-row-wrap">
                <div className=" text-3xl font-semibold pb-4">
                  Review Title
                  <span className=" text-xl font-light"> | 5 stars</span>
                </div>
                <p className="text-xl pb-4">
                  "Remaining Reason" became an instant hit, praised for its
                  haunting sound and emotional depth. A viral performance
                  brought it widespread recognition, making it one of Dio Lupa’s
                  most iconic tracks.
                </p>
                <span className="text-xl">Month Date, Year</span>
                <div className="border-b border-gray-300 mt-4"></div>
              </li>
            </ul>
          </div>

          {/* Pagination */}
          <div className="flex justify-center p-4">
            <div className="join">
              <button
                className="join-item btn btn-outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <input
                  key={i}
                  className="join-item btn btn-square"
                  type="radio"
                  name="options"
                  aria-label={`${i + 1}`}
                  checked={currentPage === i + 1}
                  onChange={() => setCurrentPage(i + 1)}
                />
              ))}

              <button
                className="join-item btn btn-outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
