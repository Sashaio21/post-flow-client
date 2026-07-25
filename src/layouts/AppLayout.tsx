import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header>
        <nav>
          <Link to="/posts">Посты</Link>
          {/* <Link to="/social-connections">Подключения</Link> */}
        </nav>
        <span>{user?.email}</span>
        <button onClick={logout}>Выйти</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}