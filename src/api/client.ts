import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // обязательно — иначе браузер не будет ни отправлять,
                         // ни принимать httpOnly cookie при кросс-доменных запросах
});

// Эндпоинты, где 401 — это часть обычной логики формы (неверный пароль,
// невалидный код и т.п.), а не признак протухшей cookie — редиректить не нужно
const AUTH_ENDPOINTS = ["/users/login", "/users/register", "/users/verify", "/users/me"];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.includes(path));

    if (error.response?.status === 401 && !isAuthEndpoint) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);