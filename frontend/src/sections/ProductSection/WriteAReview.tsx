import { useState } from "react";
import reviewService from "../../services/api/reviewService";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/toastSlice";

type Props = {
  book_id: number;
  onReviewSubmitted: () => void;
};

const WriteAReview = ({ book_id, onReviewSubmitted }: Props) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [rating, setRating] = useState(1);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    // Validate that title and details are not empty
    if (!title.trim()) {
      dispatch(
        showToast({
          message: "Title cannot be empty.",
          type: "error",
        })
      );
      return;
    }

    try {
      await reviewService.createReview({
        book_id,
        review_title: title,
        review_details: details,
        review_date: new Date().toISOString(),
        rating_star: rating,
      });

      // Reset form after successful submission
      setTitle("");
      setDetails("");
      setRating(1);
      dispatch(
        showToast({
          message: "Review submitted successfully!",
          type: "success",
        })
      );
      onReviewSubmitted();
    } catch (error) {
      dispatch(
        showToast({
          message: "Failed to submit review. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <>
      <div className="rounded-box border border-gray-300">
        <div className="border-b border-gray-300 text-2xl font-medium p-4">
          Write a Review
        </div>
        <fieldset className="fieldset p-4 border-b border-gray-300 space-y-4">
          <legend className="fieldset-legend text-lg">Add a title</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
          />
          <legend className="fieldset-legend text-lg">
            Details please! Your review helps other shoppers
          </legend>
          <textarea
            className="input input-bordered w-full h-32"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <legend className="fieldset-legend text-lg">
            Select a rating star
          </legend>
          <select
            className="select select-bordered w-full"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </fieldset>
        <div className="text-2xl font-medium p-4 flex justify-center">
          <button
            className="btn bg-gray-200 w-[80%] text-2xl font-semibold"
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteAReview;
