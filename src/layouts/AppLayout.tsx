import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../hooks/useTheme";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"
  }`;

// Пункты бокового меню. Календарь пока не строим — ссылку не добавляем,
// чтобы не вести на несуществующий экран.
const sidebarItems = [
  { to: "/posts", label: "Посты" },
  { to: "/archive", label: "Архив" },
  { to: "/connections", label: "Подключения" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-line bg-surface">
        <div className="px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-[2px] bg-scheduled rotate-45" />
            post-flow
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-2 text-muted"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <span className="text-sm text-muted">{user?.email}</span>

            <button
              type="button"
              onClick={() => logout().then(() => navigate("/login", { replace: true }))}
              className="text-sm px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-[220px] shrink-0 bg-surface border-r border-line p-4 flex flex-col gap-1 sticky top-14 h-[calc(100vh-56px)]">
          {sidebarItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </aside>

        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}