import axios from "axios";

export interface Book {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  sub_price: number;
  author_name: string;
}

export interface BooksResponse {
  books: Book[];
  total_items: number;
  total_pages: number;
  start_item: number;
  end_item: number;
  limit: number;
  page: number;
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/books";

const api = axios.create({
  baseURL: baseURL,
});

const bookService = {
  async getBooks({
    sort,
    limit,
    offset,
    category,
    author,
    rating,
  }: {
    sort: string;
    limit: number;
    offset: number;
    category?: string;
    author?: string;
    rating?: string;
  }): Promise<BooksResponse> {
    const params = new URLSearchParams({
      sort,
      limit: String(limit),
      offset: String(offset),
      ...(category && { category }),
      ...(author && { author }),
      ...(rating && { rating }),
    });

    const response = await api.get<BooksResponse>(`?${params.toString()}`);
    console.log("Response from API:", response.data);
    return response.data;
  },

  async getTop10MostDiscountedBooks(): Promise<Book[]> {
    const response = await api.get<{ books: Book[] }>(
      "/top_10_most_discounted"
    );

    return response.data.books;
  },

  async getTop8Books(sort: string): Promise<Book[]> {
    const response = await api.get<{ books: Book[] }>(`/top_8?sort=${sort}`);
    return response.data.books;
  },
};

export default bookService;
