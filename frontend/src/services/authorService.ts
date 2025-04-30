import axios from "axios";

interface Author {
  id: number;
  author_name: string;
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/authors";

const api = axios.create({
  baseURL: baseURL,
});

const authorService = {
  async get_all_authors(): Promise<Author[]> {
    const response = await api.get<{ authors: Author[] }>(`/`);
    return response.data.authors;
  },
};

export default authorService;
