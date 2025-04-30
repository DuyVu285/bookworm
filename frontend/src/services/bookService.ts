import axios from "axios";

export interface TopBooks {
  id: number;
  book_title: string;
  book_price: number;
  book_cover_photo: string;
  sub_price: number;
  author_name: string;
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/books";

const api = axios.create({
  baseURL: baseURL,
});

const bookService = {
  async getTop10MostDiscountedBooks(): Promise<TopBooks[]> {
    const response = await api.get<{ books: TopBooks[] }>(
      "/top_10_most_discounted"
    );
    return response.data.books;
  },

  async getTop8Books(sort: string): Promise<TopBooks[]> {
    const response = await api.get<{ books: TopBooks[] }>(
      `/top_8?sort=${sort}`
    );
    return response.data.books;
  },
};

export default bookService;
