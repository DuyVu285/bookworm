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

const TOKEN_KEY = "access_token";

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
    // Only attempt to refresh the token once
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

const authService = {
  // Login and get access token
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
        store.dispatch(setAccessToken(response.data.access_token)); // Store token in Redux
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

  // Logout and clear user and token from state and local storage
  async logout(): Promise<void> {
    try {
      await api.post(
        "/users/logout",
        {},
        { headers: authService.getAuthHeader() }
      );
      store.dispatch(clearUser());
      store.dispatch(clearAccessToken());
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  async getUser(): Promise<any> {
    try {
      const response = await api.get("/users/me", {
        headers: authService.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  // Try to refresh the access token
  async tryRefreshToken() {
    try {
      const response = await api.post("/users/refresh");
      const { access_token } = response.data;
      store.dispatch(setAccessToken(access_token)); // Store refreshed token in Redux
      return true;
    } catch (err) {
      console.warn("Token refresh failed", err);
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
