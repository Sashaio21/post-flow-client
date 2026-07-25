import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === "true";

export function ProtectedRoute() {
  const { token } = useAuth();

  if (SKIP_AUTH) {
    return <Outlet />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}