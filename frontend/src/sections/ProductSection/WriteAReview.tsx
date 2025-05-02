const WriteAReview = () => {
  return (
    <>
      <div className="border border-gray-300">
        <div className="border-b border-gray-300 text-2xl font-medium p-4 ">
          Write a Review
        </div>
        <fieldset className="fieldset p-4 border-b border-gray-300">
          <legend className="fieldset-legend text-lg">Add a title</legend>
          <input type="text" className="input w-[100%] " />
          <legend className="fieldset-legend text-lg">
            Details please! Your review helps other shoppers
          </legend>
          <input type="text" className="input w-[100%] h-32" />
          <legend className="fieldset-legend text-lg">
            Select a rating star{" "}
          </legend>
          <input
            type="number"
            min="1"
            max="5"
            className="input w-[100%]"
            value={1}
          />
        </fieldset>
        <div className="text-2xl font-medium p-4 flex justify-center">
          <button className="btn w-[80%] text-2xl font-semibold">
            Submit Review{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteAReview;
