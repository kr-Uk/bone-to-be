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
    const requestUrl = error.config?.url ?? "";
    const shouldSkipAuthRedirect = requestUrl.includes("/auth/me");

    // 401 Unauthorized 처리
    if (status === 401 && !shouldSkipAuthRedirect) {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    // 403 Forbidden 로깅
    if (status === 403) {
      console.warn("[403 Forbidden] 접근 권한이 없습니다:", requestUrl);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
