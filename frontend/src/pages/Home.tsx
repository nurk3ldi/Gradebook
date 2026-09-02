import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../components/Button";
import { api } from "../lib/api";
import { clearToken, getToken } from "../lib/auth";

type User = { id: number; email: string; role: string };

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login", { replace: true });
      return;
    }
    api<User>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        clearToken();
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-xs space-y-3">
        <p className="text-center text-sm text-neutral-900">{user.email}</p>
        <Button type="button" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </main>
  );
}
