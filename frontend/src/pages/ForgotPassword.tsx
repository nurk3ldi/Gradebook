import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Input } from "../components/Input";
import { LinkButton } from "../components/LinkButton";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setError("");
    setLoading(true);
    try {
      const result = await api<{ message: string; reset_token: string | null }>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email: form.get("email") }),
        },
      );
      // Дев режимде пошта жіберілмейді — сервер токенді бірден қайтарады.
      if (result.reset_token) {
        navigate(`/reset-password?token=${result.reset_token}`);
        return;
      }
      setSent(result.message);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-xs space-y-3">
          <p className="text-center text-xs text-neutral-500">{sent}</p>
          <LinkButton to="/login">Войти</LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <Input
          type="email"
          name="email"
          placeholder="Почта"
          autoComplete="email"
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" disabled={loading}>
          {loading ? "Отправка…" : "Сбросить пароль"}
        </Button>
        <LinkButton to="/login">Войти</LinkButton>
      </form>
    </main>
  );
}
