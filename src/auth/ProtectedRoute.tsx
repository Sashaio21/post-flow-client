import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === "true";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (SKIP_AUTH) {
    return <Outlet />;
  }

  // Пока идёт запрос /test-auth (проверка cookie) — ничего не решаем,
  // иначе на долю секунды мелькнёт редирект на /login у реально
  // авторизованного пользователя
  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Загрузка...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}