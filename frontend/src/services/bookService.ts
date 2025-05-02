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
    page,
    limit,
    sort,
    category,
    author,
    rating,
  }: {
    page: number;
    limit: number;
    sort: string;
    category?: number;
    author?: number;
    rating?: number;
  }): Promise<BooksResponse> {
    const params = new URLSearchParams({
      page: String(page),
      sort,
      limit: String(limit),
      ...(category !== undefined ? { category: String(category) } : {}),
      ...(author !== undefined ? { author: String(author) } : {}),
      ...(rating !== undefined ? { rating: String(rating) } : {}),
    });

    const response = await api.get<BooksResponse>(`?${params.toString()}`);
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
