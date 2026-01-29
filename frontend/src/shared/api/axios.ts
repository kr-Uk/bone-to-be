import axios, { type AxiosError } from "axios";

export const baseURL =
  import.meta.env.VITE_API_MOCKING === "enabled"
    ? import.meta.env.VITE_MOCK_BASE_URL
    : import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const status = error.response?.status;
    if (status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
