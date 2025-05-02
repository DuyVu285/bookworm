import { useState } from "react";
import reviewService from "../../services/reviewService";
import Toast from "../../components/Toast";

interface WriteAReviewProps {
  book_id: number;
}

const WriteAReview = ({ book_id }: WriteAReviewProps) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [rating, setRating] = useState(1);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  const showToast = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info"
  ) => {
    setToast({ message, type });
  };

  const handleSubmit = async () => {
    // Validate that title and details are not empty
    if (!title.trim()) {
      showToast("Title cannot be empty.", "error");
      return;
    }

    if (!details.trim()) {
      showToast("Details cannot be empty.", "error");
      return;
    }

    try {
      console.log("Submitting review:", {
        book_id,
        review_title: title,
        review_details: details,
        rating_star: rating,
      });

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
      showToast("Review submitted successfully!", "success");
    } catch (error) {
      showToast("Failed to submit review. Please try again.", "error");
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      <div className="border border-gray-300">
        <div className="border-b border-gray-300 text-2xl font-medium p-4">
          Write a Review
        </div>
        <fieldset className="fieldset p-4 border-b border-gray-300 space-y-4">
          <legend className="fieldset-legend text-lg">Add a title</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
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
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </fieldset>
        <div className="text-2xl font-medium p-4 flex justify-center">
          <button
            className="btn btn-primary w-[80%] text-2xl font-semibold"
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
