import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { authApi } from "../api/auth";
import { useAuth } from "./AuthContext";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Заполните email и пароль",
  401: "Неверный email или пароль",
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setSession } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { user, token } = await authApi.login(email, password);
      setSession(user, token);
      navigate("/posts", { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;

        // Email не подтверждён — сразу отправляем на страницу ввода кода
        if (status === 403) {
          navigate(`/verify?email=${encodeURIComponent(email)}`);
          return;
        }

        setError(ERROR_MESSAGES[status ?? 0] ?? "Не удалось войти, попробуйте позже");
      } else {
        setError("Не удалось войти, попробуйте позже");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}