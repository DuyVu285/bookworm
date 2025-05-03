import axios from "axios";

interface Category {
  id: number;
  category_name: string;
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/categories";

const api = axios.create({
  baseURL: baseURL,
});

const categoryService = {
  async get_all_categories(): Promise<Category[]> {
    try {
      const response = await api.get<{ categories: Category[] }>(`/`);
      return response.data.categories;
    } catch (error) {
      throw error;
    }
  },

  async get_category_by_id(category_id: number): Promise<Category> {
    try {
      const response = await api.get<Category>(`/${category_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default categoryService;
