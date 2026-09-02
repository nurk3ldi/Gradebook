import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Header } from "../components/Header";
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

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header email={user?.email} onLogout={handleLogout} />
      <main className="px-4 py-6" />
    </div>
  );
}
