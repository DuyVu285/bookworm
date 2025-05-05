import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../../store";
import { setUser } from "../../store/userSlice";

const baseURL = import.meta.env.VITE_SERVER_API_URL;

interface LoginPayload {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface User {
  first_name: string;
  last_name: string;
  id: number;
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const authService = {
  async login(payload: LoginPayload): Promise<string> {
    try {
      const form = new URLSearchParams();
      form.append("grant_type", "password");
      form.append("username", payload.username);
      form.append("password", payload.password);
      form.append("scope", "");
      form.append("client_id", "string");
      form.append("client_secret", "string");

      const response = await api.post<TokenResponse>("/users/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.status === 200 && response.data.access_token) {
        const userResponse = await api.get<User>("/users/me", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });

        store.dispatch(setUser(userResponse.data));
        const expiresInSeconds = response.data.expires_in;
        const now = new Date();
        const expiryDate = new Date(now.getTime() + expiresInSeconds * 1000);

        Cookies.set("access_token", response.data.access_token, {
          expires: expiryDate,
        });
        Cookies.set(
          "token_expiry",
          (Date.now() + expiresInSeconds * 1000).toString(),
          {
            expires: expiryDate,
          }
        );

        return "Login successful";
      } else {
        return "Login failed: unexpected response";
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || "Login failed";
      throw new Error(message);
    }
  },

  async logout(): Promise<string> {
    try {
      await api.post("/users/logout", {}, { headers: this.getAuthHeader() });
      Cookies.remove("access_token");
      Cookies.remove("token_expiry");
      Cookies.remove("refresh_token");
      return "Logout successful";
    } catch (error: any) {
      const message = error.response?.data?.detail || "Logout failed";
      throw new Error(message);
    }
  },

  async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await api.post("/users/refresh");

      const expiresInSeconds = response.data.expires_in;
      const now = new Date();
      const expiryDate = new Date(now.getTime() + expiresInSeconds * 1000);

      Cookies.set("access_token", response.data.access_token, {
        expires: expiryDate,
      });
      Cookies.set(
        "token_expiry",
        (Date.now() + expiresInSeconds * 1000).toString(),
        {
          expires: expiryDate,
        }
      );

      if (response.status === 200 && response.data.access_token) {
        const userResponse = await api.get<User>("/users/me", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });

        store.dispatch(setUser(userResponse.data));
        const expiresInSeconds = response.data.expires_in;
        const now = new Date();
        const expiryDate = new Date(now.getTime() + expiresInSeconds * 1000);

        Cookies.set("access_token", response.data.access_token, {
          expires: expiryDate,
        });
        Cookies.set(
          "token_expiry",
          (Date.now() + expiresInSeconds * 1000).toString(),
          {
            expires: expiryDate,
          }
        );
      }

      return true;
    } catch (err) {
      Cookies.remove("access_token");
      Cookies.remove("token_expiry");
      return false;
    }
  },

  async getUser(): Promise<User> {
    const tokenExpiry = Cookies.get("token_expiry");

    if (!tokenExpiry) {
      const refreshed = await this.tryRefreshToken();
      if (!refreshed) {
        throw new Error("Token expired and refresh failed");
      }
    }

    try {
      const response = await api.get<User>("/users/me", {
        headers: this.getAuthHeader(),
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuthHeader(): { Authorization: string } | {} {
    const token = Cookies.get("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  isLoggedIn(): boolean {
    const token = Cookies.get("access_token");
    const expiry = Cookies.get("token_expiry");
    if (!token || !expiry) return false;
    return Date.now() < Number(expiry);
  },
};

export default authService;
