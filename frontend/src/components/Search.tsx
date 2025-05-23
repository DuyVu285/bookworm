import { useEffect, useState } from "react";
import bookService from "../services/api/bookService";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  book_title: string;
  book_cover_photo: string;
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") return setSuggestions([]);
      try {
        const response = await bookService.searchBooks(query);
        const mappedSuggestions: Book[] = response.map((item) => ({
          id: item.id,
          book_title: item.book_title || "",
          book_cover_photo: item.book_cover_photo || "",
        }));
        setSuggestions(mappedSuggestions);
        setShowDropdown(true);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    };

    const delay = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelect = (item: string) => {
    setQuery(item);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
  };

  return (
    <div className="relative w-full sm:w-[20rem]">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="input w-full flex items-center gap-2 border border-gray-300 rounded px-2 py-1"
      >
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
          value={query}
          onChange={handleInputChange}
          required
          placeholder="Search books..."
          className="flex-1 outline-none bg-transparent"
        />
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white shadow-lg mt-1 w-full rounded border border-gray-200">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item.book_title)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <Link to={`/Book/${item.id}`}>
                <div className="flex flex-row items-center">
                  <img
                    src={item.book_cover_photo}
                    alt={item.book_title}
                    className="w-8 h-8 rounded mr-2"
                  />
                  {item.book_title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
