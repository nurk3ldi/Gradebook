import type { FormEvent } from "react";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

export default function Login() {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          autoComplete="current-password"
          required
        />
        <Button type="submit">Войти</Button>
        <button
          type="button"
          className="block w-full text-center text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
        >
          Забыли пароль?
        </button>
      </form>
    </main>
  );
}
