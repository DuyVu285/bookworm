import axios from "axios";
import { store } from "../../store";
import { clearUser, setUser } from "../../store/userSlice";
import { clearAccessToken, setAccessToken } from "../../store/authSlice";

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
}

export interface User {
  first_name: string;
  last_name: string;
  id: number;
}

// Attach Authorization header to each request if access token is available
api.interceptors.request.use((config) => {
  const token = store.getState().auth.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh logic on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and if retrying is allowed
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await authService.tryRefreshToken();
      const newToken = store.getState().auth.access_token;

      if (success && newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry the failed request
      }

      // If refresh fails, logout and clear user data
      store.dispatch(clearUser());
      store.dispatch(clearAccessToken());
    }

    return Promise.reject(error);
  }
);
let isRefreshing = false;
const authService = {
  // Login and get access token
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200 && response.data.access_token) {
        const userResponse = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });
        store.dispatch(setUser(userResponse.data));
        store.dispatch(setAccessToken(response.data.access_token));
        return "Login successful";
      } else {
        return "Login failed: unexpected response from server";
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || "Login failed";
      throw new Error(message);
    }
  },

  async logout(): Promise<string> {
    try {
      await api.post(
        "/users/logout",
        {},
        { headers: authService.getAuthHeader() }
      );
      store.dispatch(clearUser());
      store.dispatch(clearAccessToken());
      return "Logout successful";
    } catch (error: any) {
      const message = error.response?.data?.detail || "Logout failed";
      throw new Error(message);
    }
  },

  async getUser(): Promise<User> {
    try {
      const response = await api.get("/users/me", {
        headers: authService.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Try to refresh the access token
  async tryRefreshToken() {
    if (isRefreshing) return false; 

    try {
      isRefreshing = true; 
      const response = await api.post("/users/refresh");
      const { access_token } = response.data;
      store.dispatch(setAccessToken(access_token));
      isRefreshing = false;
      return true;
    } catch (err: any) {
      isRefreshing = false;
      return false;
    }
  },

  // Check if the user is logged in based on the presence of the access token in Redux
  isLoggedIn(): boolean {
    return !!store.getState().auth.access_token;
  },

  // Get the Authorization header with the current access token
  getAuthHeader(): { Authorization: string } | {} {
    const token = store.getState().auth.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;
