import axios from "axios";
import { store } from "../store";
import { setUser } from "../store/userSlice";

const baseURL = import.meta.env.VITE_SERVER_API_URL;
const api = axios.create({ baseURL });

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

const TOKEN_KEY = "access_token";

const authService = {
  async login(payload: LoginPayload): Promise<void> {
    try {
      const form = new URLSearchParams();
      form.append("grant_type", "password");
      form.append("username", payload.username);
      form.append("password", payload.password);
      form.append("scope", "");
      form.append("client_id", "string");
      form.append("client_secret", "string");

      const response = await api.post<TokenResponse>("/users/token", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200 && response.data.access_token) {
        console.log(
          "Login successful, access token:",
          response.data.access_token
        );
        const userResponse = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });
        store.dispatch(setUser(userResponse.data));
        console.log("User data:", userResponse.data);
        localStorage.setItem(TOKEN_KEY, response.data.access_token);
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Error during login:", error.message);
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getAuthHeader(): { Authorization: string } | {} {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;
