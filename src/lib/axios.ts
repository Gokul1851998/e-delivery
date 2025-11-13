import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";

const api = axios.create({
  baseURL: "https://nexlearn.noviindusdemosites.in/",
});

// ✅ Fix: use InternalAxiosRequestConfig, not AxiosRequestConfig
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = getRefreshToken();

        // if there's no refresh token, force logout
        if (!refresh) {
          clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        const res = await axios.post("https://nexlearn.noviindusdemosites.in/auth/refresh", {
          refresh_token: refresh,
        });

        // ensure we got new tokens back
  const { access_token, refresh_token } = (res.data as { access_token?: string; refresh_token?: string }) || {};
        if (!access_token) {
          clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

  // access_token is guaranteed here (checked above); coerce types for the setter
  setTokens(access_token as string, (refresh_token as string) || "");

        // reattach the new token before retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshErr) {
        // refresh failed — clear tokens and redirect to login
        clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
