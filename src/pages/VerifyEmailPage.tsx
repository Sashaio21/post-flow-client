import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { authApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setSession } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // verify возвращает { user, token } — сразу логиним пользователя
      const { user, token } = await authApi.verifyEmail(email, code);
      setSession(user, token);
      navigate("/posts", { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        // Бэкенд отдаёт разный текст на разные кейсы (USER_NOT_FOUND,
        // ALREADY_VERIFIED, INVALID_CODE, CODE_EXPIRED) — показываем как есть
        const serverMessage = (err.response?.data as { message?: string } | undefined)
          ?.message;
        setError(serverMessage ?? "Не удалось подтвердить email");
      } else {
        setError("Не удалось подтвердить email");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <h1 className="text-xl font-semibold mb-4">Подтверждение email</h1>
      <p className="text-sm text-gray-600 mb-4">
        Мы отправили код подтверждения на {email || "вашу почту"}
      </p>

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
          type="text"
          placeholder="Код из письма"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {isSubmitting ? "Проверяем..." : "Подтвердить"}
        </button>
      </form>
    </div>
  );
}