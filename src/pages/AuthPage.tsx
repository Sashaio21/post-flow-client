import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { LoginForm } from "../auth/LoginForm";
import { RegisterForm } from "../auth/RegisterForm";
import { useAuth } from "../auth/AuthContext";

type Tab = "login" | "register";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Пока не знаем, валидна ли cookie — не показываем форму и не редиректим
  if (isLoading) {
    return null;
  }

  // Уже авторизован (например, вернулись назад в истории браузера) —
  // на форме входа/регистрации ему делать нечего
  if (isAuthenticated) {
    return <Navigate to="/posts" replace />;
  }

  const activeTab: Tab = location.pathname === "/register" ? "register" : "login";

  function switchTab(tab: Tab) {
    navigate(tab === "login" ? "/login" : "/register");
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <div className="flex mb-6 border-b">
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "login"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => switchTab("register")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "register"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Регистрация
        </button>
      </div>

      {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}