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
    const response = await api.get<{ categories: Category[] }>(`/`);
    return response.data.categories;
  },

  async get_category_by_id(category_id: number): Promise<Category> {
    const response = await api.get<Category>(`/${category_id}`);
    return response.data;
  },
};

export default categoryService;
