type ReviewListProps = {
  reviews: Review[];
};

type Review = {
  id: number;
  review_title: string;
  review_details?: string;
  review_date: string;
  rating_star: number;
};

const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-xl italic text-gray-600 bg-gray-100 rounded">
          No reviews found.
        </p>
      ) : (
        <ul className="list bg-base-100 rounded-box gap-4 bg-gray-100">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="list-row-wrap min-h-[8rem] rounded-lg"
            >
              <div className="text-3xl font-semibold">
                {review.review_title}
                <span className="text-xl font-light">
                  {" "}
                  | {review.rating_star} stars
                </span>
              </div>
              <p className="text-xl pb-4">{review.review_details}</p>
              <span className="text-xl">
                {new Date(review.review_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <div className="border-b border-gray-300 mt-4"></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
