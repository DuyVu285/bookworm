import axios from "axios";
import Cookies from "js-cookie";

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

// Attach Authorization header to each request if access token is available
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  const tokenExpiry = Cookies.get("token_expiry");

  // Check if the token is expired
  if (token && tokenExpiry && Date.now() > Number(tokenExpiry)) {
    // Token has expired, refresh the token
    Cookies.remove("access_token");
    Cookies.remove("token_expiry");
    // Trigger refresh logic
    authService.tryRefreshToken(); // This will trigger token refresh
    return Promise.reject("Token expired");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

        // Set user in cookies
        Cookies.set("user", JSON.stringify(userResponse.data));
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
      Cookies.remove("user");
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

    // Check if the token has expired before making the request
    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      throw new Error("Token has expired. Please log in again.");
    }

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
    console.log("tryRefreshToken", isRefreshing);
    if (isRefreshing) return false;

    try {
      isRefreshing = true;
      console.log("tryRefreshToken");
      const response = await api.post("/users/refresh");
      const { access_token, expires_in } = response.data;
      console.log("Refresh token", access_token);

      // Store the new token and its expiration
      Cookies.set("access_token", access_token, {
        expires: expires_in / 1800,
      });
      Cookies.set("token_expiry", (Date.now() + expires_in * 1000).toString(), {
        expires: expires_in / 1800,
      });

      isRefreshing = false;
      return true;
    } catch (err: any) {
      isRefreshing = false;
      Cookies.remove("access_token");
      Cookies.remove("token_expiry");
      return false;
    } finally {
      isRefreshing = false;
    }
  },

  // Check if the user is logged in based on the presence of the access token in cookies
  isLoggedIn(): boolean {
    console.log("isLoggedIn", !!Cookies.get("access_token"));
    return !!Cookies.get("access_token");
  },

  // Get the Authorization header with the current access token
  getAuthHeader(): { Authorization: string } | {} {
    const token = Cookies.get("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;
