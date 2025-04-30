import axios from "axios";

interface Author {
  id: number;
  author_name: string;
  author_bio: string;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/authors",
});

const authorService = {
  async get_all_authors(): Promise<Author[]> {
    const response = await api.get<{ authors: Author[] }>(`/`);
    return response.data.authors;
  },
};

export default authorService;
