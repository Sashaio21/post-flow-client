import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, type AuthUser } from "../api/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // идёт проверка cookie при старте приложения
  setSession: (user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При каждой загрузке приложения (F5, открыли новую вкладку) — токен
  // недоступен из JS, поэтому единственный способ узнать "залогинен ли я" —
  // спросить сервер, валидна ли cookie
  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // Вызывается после /login и после /verify — обоим достаточно вернуть user,
  // сам токен сервер уже положил в cookie ответом
  function setSession(newUser: AuthUser) {
    setUser(newUser);
  }

  async function logout() {
    try {
      await authApi.logout(); // чистит cookie на сервере
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}