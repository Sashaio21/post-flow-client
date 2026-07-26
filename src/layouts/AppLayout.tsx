import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../hooks/useTheme";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded text-sm font-medium transition-colors ${
    isActive
      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`;

export function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            <NavLink to="/posts" className={navLinkClass}>
              Посты
            </NavLink>
            {/* Появятся по мере готовности экранов */}
            {/* <NavLink to="/social-connections" className={navLinkClass}>Подключения</NavLink> */}
            {/* <NavLink to="/templates" className={navLinkClass}>Шаблоны</NavLink> */}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>

            <button
              type="button"
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}