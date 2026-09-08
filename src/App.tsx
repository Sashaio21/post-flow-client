import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "./pages/AuthPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { PostsPage } from "./pages/PostsPage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { PostFormPage } from "./pages/PostFormPage";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Публичные маршруты — без токена, без AppLayout */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />

          {/* Защищённая зона: ProtectedRoute проверяет токен,
              AppLayout рисует общую шапку/навигацию поверх страниц */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/posts" replace />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/new" element={<PostFormPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/archive" element={<h1>Archive</h1>} />
            </Route>
          </Route>

          {/* Любой неизвестный путь — на посты (если авторизован)
              или на логин (если нет, за счёт ProtectedRoute внутри) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}