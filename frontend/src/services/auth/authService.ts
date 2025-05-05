import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../../store";
import { clearUser, setUser } from "../../store/userSlice";

const baseURL = import.meta.env.VITE_SERVER_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  first_name: string;
  last_name: string;
  id: number;
}

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  const tokenExpiry = Cookies.get("token_expiry");

  if (token && tokenExpiry && Date.now() > Number(tokenExpiry)) {
    // Expired token - just clear for now, retry will happen in response interceptor
    Cookies.remove("access_token");
    Cookies.remove("token_expiry");
    store.dispatch(clearUser());
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- RESPONSE INTERCEPTOR WITH REFRESH + QUEUE ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get("refresh_token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshed = await authService.tryRefreshToken();
        const newToken = Cookies.get("access_token");

        if (!refreshed || !newToken) {
          throw new Error("Refresh failed");
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(clearUser());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- AUTH SERVICE OBJECT ---
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
        const userResponse = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });

        store.dispatch(setUser(userResponse.data));
        Cookies.set("access_token", response.data.access_token, {
          expires: response.data.expires_in / 86400,
        });
        Cookies.set(
          "token_expiry",
          (Date.now() + response.data.expires_in * 1000).toString(),
          { expires: response.data.expires_in / 86400 }
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
      return "Logout successful";
    } catch (error: any) {
      const message = error.response?.data?.detail || "Logout failed";
      throw new Error(message);
    }
  },

  async getUser(): Promise<User> {
    const tokenExpiry = Cookies.get("token_expiry");
    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      throw new Error("Token expired");
    }

    try {
      const response = await api.get("/users/me", {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await api.post("/users/refresh");
      const { access_token, expires_in } = response.data;

      Cookies.set("access_token", access_token, {
        expires: expires_in / 86400,
      });
      Cookies.set("token_expiry", (Date.now() + expires_in * 1000).toString(), {
        expires: expires_in / 86400,
      });

      return true;
    } catch (err) {
      Cookies.remove("access_token");
      Cookies.remove("token_expiry");
      return false;
    }
  },

  isLoggedIn(): boolean {
    return !!Cookies.get("access_token");
  },

  getAuthHeader(): { Authorization: string } | {} {
    const token = Cookies.get("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export { api }; // if needed for general API access
export default authService;
