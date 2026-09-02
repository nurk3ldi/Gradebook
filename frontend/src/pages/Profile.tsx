import { useEffect, useState, type FormEvent } from "react";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorText } from "../components/ErrorText";
import { Layout } from "../components/Layout";
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
    <Layout
      user={profile}
      onLogout={logout}
      title="Профиль"
      subtitle="Личные данные"
    >
      {profile && (
        <Card title={`${profile.email} · ${ROLE_LABELS[profile.role]}`}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="full_name" className="block text-sm text-muted">
                Фамилия, имя, отчество
              </label>
              <Input
                id="full_name"
                type="text"
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                placeholder="Иванов Иван Иванович"
                autoComplete="name"
                maxLength={255}
                className="w-full"
              />
              {error && <ErrorText>{error}</ErrorText>}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Сохранение…" : "Сохранить"}
                </Button>
                {saved && !error && (
                  <span className="text-sm text-muted transition-opacity duration-200 starting:opacity-0">
                    Сохранено
                  </span>
                )}
              </div>
            </form>
          </Card>
        )}
    </Layout>
  );
}
