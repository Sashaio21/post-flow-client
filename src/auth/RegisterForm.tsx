import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { authApi } from "../api/auth";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Заполните email и пароль",
  409: "Этот email уже зарегистрирован",
};

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // register не выдаёт токен — только отправляет код на почту
      await authApi.register(email, password);
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        setError(
          ERROR_MESSAGES[status ?? 0] ?? "Не удалось зарегистрироваться, попробуйте позже"
        );
      } else {
        setError("Не удалось зарегистрироваться, попробуйте позже");
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
        minLength={6}
        className="border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Отправляем..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}