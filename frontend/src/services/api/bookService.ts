import axios from "axios";

interface Book {
  id: number;
  book_title: string;
  book_price: number;
  book_summary: string;
  book_cover_photo: string;
  sub_price: number;
  author_name: string;
  category_name?: string;
}

interface BooksResponse {
  books: Book[];
  total_items: number;
  total_pages: number;
  start_item: number;
  end_item: number;
  limit: number;
  page: number;
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/books";

const api = axios.create({ baseURL });

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
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        ...(category !== undefined && { category: String(category) }),
        ...(author !== undefined && { author: String(author) }),
        ...(rating !== undefined && { rating: String(rating) }),
      });

      const response = await api.get<BooksResponse>(`?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTop10MostDiscountedBooks(): Promise<Book[]> {
    try {
      const response = await api.get<{ books: Book[] }>(
        "/top_10_most_discounted"
      );
      return response.data.books;
    } catch (error) {
      throw error;
    }
  },

  async getTop8Books(sort: string): Promise<Book[]> {
    try {
      const response = await api.get<{ books: Book[] }>(`/top_8?sort=${sort}`);
      return response.data.books;
    } catch (error) {
      throw error;
    }
  },

  async getBookById(book_id: number): Promise<Book> {
    try {
      const response = await api.get<Book>(`/book/${book_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async searchBooks(search_terms: string): Promise<string[]> {
    try {
      const response = await api.get<string[]>(
        `/search?search_terms=${search_terms}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bookService;
