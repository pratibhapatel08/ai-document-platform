import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  },
);

export type ApiClient = typeof apiClient;

export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export type { InternalAxiosRequestConfig };
