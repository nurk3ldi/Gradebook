import { useEffect, useState, type FormEvent } from "react";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../lib/api";
import { useSession } from "../lib/session";
import { ROLE_LABELS, type User } from "../lib/types";

export default function Profile() {
  const { user, logout } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setProfile(user), [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = String(new FormData(event.currentTarget).get("full_name"));

    setError("");
    setSaved(false);
    setLoading(true);
    try {
      setProfile(
        await api<User>("/api/users/me", {
          method: "PATCH",
          body: JSON.stringify({ full_name: fullName }),
        }),
      );
      setSaved(true);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header user={profile} onLogout={logout} />
      <main className="mx-auto max-w-xs space-y-3 px-4 py-6">
        {profile && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              placeholder="Фамилия Имя Отчество"
              autoComplete="name"
              maxLength={255}
            />
            <p className="text-xs text-neutral-500">
              {profile.email} · {ROLE_LABELS[profile.role]}
            </p>
            {error && <ErrorText>{error}</ErrorText>}
            {saved && !error && (
              <p className="text-xs text-neutral-500 transition-opacity duration-200 starting:opacity-0">
                Сохранено
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение…" : "Сохранить"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
