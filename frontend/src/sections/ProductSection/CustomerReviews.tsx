import { useEffect, useState } from "react";
import Breadcrumbs from "../../layout/Breadcrumbs";
import reviewService from "../../services/api/reviewService";
import GridToolbar from "../../components/GridToolbar";
import { FILTER_KEYS, useQueryFilters } from "../../hooks/useQueryFilters";
import Pagination from "../../components/Pagination";
import ReviewList from "../../components/ReviewsList";

type Review = {
  id: number;
  review_title: string;
  review_details?: string;
  review_date: string;
  rating_star: number;
};

type Props = {
  book_id: number;
  refreshTrigger: boolean;
};

const CustomerReviews = ({ book_id, refreshTrigger }: Props) => {
  const sortOptions = [
    { key: "newest", label: "date: newest to oldest" },
    { key: "oldest", label: "date: oldest to newest" },
  ];

  const { getParam, getIntParam, updateParams, searchParams } =
    useQueryFilters();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    limit: 20,
    total_items: 0,
    total_pages: 1,
    start_item: 1,
    end_item: 20,
  });
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [starDistribution, setStarDistribution] = useState<
    { rating_star: number; count: number }[] | null
  >(null);

  // Fetch reviews, average rating, and star distribution
  useEffect(() => {
    async function fetchReviews() {
      try {
        const page = getIntParam(FILTER_KEYS.PAGE) || 1;
        const sort = getParam(FILTER_KEYS.SORT) || "newest";
        const limit = getIntParam(FILTER_KEYS.LIMIT) || 20;

        const response = await reviewService.getReviewsByBookId({
          book_id,
          page,
          sort,
          limit,
          rating: selectedRating,
        });
        setReviews(response.reviews);
        setPageInfo({
          page: response.page,
          limit: response.limit,
          total_items: response.total_items,
          total_pages: response.total_pages,
          start_item: response.start_item,
          end_item: response.end_item,
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          setReviews([]);
          setPageInfo((prev) => ({
            ...prev,
            total_items: 0,
            total_pages: 0,
          }));
        } else {
          console.error("Failed to fetch reviews:", error);
        }
      }
    }

    async function fetchAverageRating() {
      const response = await reviewService.getAverageRating(book_id);
      setAverageRating(response);
    }

    async function fetchStarDistribution() {
      const response = await reviewService.getStarDistribution(book_id);
      setStarDistribution(response.reviews);
    }

    async function fetchTotalReviewsByBookId() {
      const response = await reviewService.getTotalReviewsByBookId(book_id);
      setTotalReviews(response);
    }

    fetchTotalReviewsByBookId();
    fetchReviews();
    fetchAverageRating();
    fetchStarDistribution();
  }, [searchParams, book_id, selectedRating, refreshTrigger]);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    updateParams({
      [FILTER_KEYS.PAGE]: newPage.toString(),
    });
  };

  const displayString = selectedRating > 0 ? `${selectedRating} star` : "";

  return (
    <>
      <div className="rounded-box border border-gray-300 bg-gray-100 p-4 sm:p-6 md:p-8 max-w-full">
        <Breadcrumbs type="Customer Reviews" value={displayString} />

        {/* Customer Ratings */}
        <div className="my-4 text-center sm:text-left">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {averageRating ? averageRating.toFixed(1) : "0.0"} Star
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex flex-wrap items-center gap-2 text-center sm:text-left text-lg sm:text-xl">
          <span
            className="font-semibold underline hover:text-blue-800 cursor-pointer"
            onClick={() => setSelectedRating(0)}
          >
            ({totalReviews})
          </span>

          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count =
              starDistribution?.find((r) => r.rating_star === rating)?.count ??
              0;
            const isSelected = selectedRating === rating;

            return (
              <span
                key={rating}
                className={`cursor-pointer ${
                  isSelected ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => setSelectedRating(isSelected ? 0 : rating)}
              >
                <span className="underline">
                  {rating} star ({count})
                </span>
                {index !== 4 && <span className="hidden sm:inline"> | </span>}
              </span>
            );
          })}
        </div>

        {/* Grid Toolbar */}
        <div className="my-4">
          <GridToolbar
            sortOptions={sortOptions}
            startItem={pageInfo.start_item}
            endItem={pageInfo.end_item}
            totalItems={pageInfo.total_items}
            itemType="reviews"
            initialItemsPerPage={pageInfo.limit}
            initialSortOption={sortOptions[0].key}
          />
        </div>

        {/* Reviews */}
        <div className="my-4">
          <ReviewList reviews={reviews} />
        </div>

        {/* Pagination */}
        {pageInfo.total_pages > 0 && (
          <div className="my-4">
            <Pagination
              currentPage={pageInfo.page}
              totalPages={pageInfo.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerReviews;
