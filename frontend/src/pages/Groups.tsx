import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { api } from "../lib/api";
import { useSession } from "../lib/session";
import type { Group, User } from "../lib/types";

export default function Groups() {
  const { user, logout } = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setGroups(await api<Group[]>("/api/groups"));
    } catch (caught) {
      setError((caught as Error).message);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void load();
    // Преподаватель тізімі тек admin-ге қолжетімді.
    if (user.role === "admin") {
      api<User[]>("/api/users")
        .then((all) => setTeachers(all.filter((item) => item.role === "teacher")))
        .catch(() => setTeachers([]));
    }
  }, [user, load]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const teacherId = data.get("teacher_id");

    setError("");
    setLoading(true);
    try {
      await api("/api/groups", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          teacher_id: teacherId ? Number(teacherId) : null,
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

  async function handleDelete(id: number) {
    setError("");
    try {
      await api(`/api/groups/${id}`, { method: "DELETE" });
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
          <Input type="text" name="name" placeholder="Название группы" required />
          {user?.role === "admin" && (
            <Select name="teacher_id" defaultValue="">
              <option value="">Без преподавателя</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name ?? teacher.email}
                </option>
              ))}
            </Select>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Создание…" : "Создать"}
          </Button>
        </form>

        {error && <ErrorText>{error}</ErrorText>}

        <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center gap-3 px-3 py-2">
              <Link
                to={`/groups/${group.id}`}
                className="w-48 truncate text-sm text-neutral-900 transition-colors duration-150 hover:text-neutral-500"
              >
                {group.name}
              </Link>
              <span className="flex-1 truncate text-xs text-neutral-500">
                {group.teacher?.full_name ?? group.teacher?.email ?? "Без преподавателя"}
              </span>
              <span className="text-xs text-neutral-500">
                {group.students_count} студ.
              </span>
              <button
                type="button"
                onClick={() => void handleDelete(group.id)}
                className="text-xs text-neutral-400 transition-colors duration-150 hover:text-red-600"
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
