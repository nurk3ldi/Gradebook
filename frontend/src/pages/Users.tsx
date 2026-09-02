import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { api } from "../lib/api";
import { useSession } from "../lib/session";
import { ROLE_LABELS, type Role, type User } from "../lib/types";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export default function Users() {
  const { user, logout } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setUsers(await api<User[]>("/api/users"));
    } catch (caught) {
      setError((caught as Error).message);
    }
  }, []);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setError("");
    setLoading(true);
    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({
          email: data.get("email"),
          full_name: data.get("full_name") || null,
          password: data.get("password"),
          role: data.get("role"),
        }),
      });
      form.reset();
      await load();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id: number, role: Role) {
    setError("");
    try {
      await api(`/api/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      await load();
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    try {
      await api(`/api/users/${id}`, { method: "DELETE" });
      await load();
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header user={user} onLogout={logout} />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
          <Input
            type="email"
            name="email"
            placeholder="Почта"
            autoComplete="off"
            required
          />
          <Input type="text" name="full_name" placeholder="Имя" />
          <Input
            type="password"
            name="password"
            placeholder="Пароль"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Select name="role" defaultValue="student">
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? "Добавление…" : "Добавить"}
          </Button>
        </form>

        {error && <ErrorText>{error}</ErrorText>}

        <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
          {users.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-2">
              <span className="w-56 truncate text-sm text-neutral-900">
                {item.email}
              </span>
              <span className="flex-1 truncate text-xs text-neutral-500">
                {item.full_name ?? "—"}
              </span>
              <Select
                value={item.role}
                disabled={item.id === user?.id}
                onChange={(event) =>
                  void handleRoleChange(item.id, event.target.value as Role)
                }
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => void handleDelete(item.id)}
                disabled={item.id === user?.id}
                className="text-xs text-neutral-400 transition-colors duration-150 hover:text-red-600 disabled:opacity-40 disabled:hover:text-neutral-400"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
