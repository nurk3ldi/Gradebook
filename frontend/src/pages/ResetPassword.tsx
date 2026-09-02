import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Input } from "../components/Input";
import { LinkButton } from "../components/LinkButton";
import { api } from "../lib/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));

    if (password !== String(form.get("passwordConfirm"))) {
      setError("Пароли не совпадают");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code: form.get("code"), password }),
      });
      setDone(true);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-xs space-y-3">
          <p className="text-center text-xs text-neutral-500">Пароль обновлён</p>
          <LinkButton to="/login">Войти</LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <p className="text-center text-xs text-neutral-500">
          Код отправлен на {email}
        </p>
        <Input
          type="text"
          name="code"
          placeholder="Код из письма"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Новый пароль"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          type="password"
          name="passwordConfirm"
          placeholder="Повторите пароль"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" disabled={loading}>
          {loading ? "Сохранение…" : "Сохранить пароль"}
        </Button>
        <LinkButton to="/forgot-password">Отправить код заново</LinkButton>
      </form>
    </main>
  );
}
