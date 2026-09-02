import type { FormEvent } from "react";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LinkButton } from "../components/LinkButton";

export default function Register() {
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
          autoComplete="new-password"
          required
        />
        <Input
          type="password"
          name="passwordConfirm"
          placeholder="Повторите пароль"
          autoComplete="new-password"
          required
        />
        <Button type="submit">Зарегистрироваться</Button>
        <LinkButton to="/login">Войти</LinkButton>
      </form>
    </main>
  );
}
