const Search = () => {
  return (
    <>
      {/* Search Bar */}
      <div className="w-full sm:w-[18rem]">
        <label className="input w-full flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
          <svg
            className="h-5 w-5 opacity-80"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search..."
            className="flex-1 outline-none bg-transparent"
          />
        </label>
      </div>
    </>
  );
};

export default Search;
