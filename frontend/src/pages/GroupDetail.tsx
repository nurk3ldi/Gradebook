import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { api } from "../lib/api";
import { useSession } from "../lib/session";
import type { GroupDetail as GroupDetailType, User } from "../lib/types";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const [group, setGroup] = useState<GroupDetailType | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setGroup(await api<GroupDetailType>(`/api/groups/${id}`));
    } catch (caught) {
      setError((caught as Error).message);
    }
  }, [id]);

  const loadStudents = useCallback(async () => {
    setStudents(await api<User[]>("/api/users?role=student").catch(() => []));
  }, []);

  useEffect(() => {
    if (!user) return;
    void load();
    void loadStudents();
    if (user.role === "admin") {
      api<User[]>("/api/users")
        .then((all) => setTeachers(all.filter((item) => item.role === "teacher")))
        .catch(() => setTeachers([]));
    }
  }, [user, load, loadStudents]);

  // Топта жоқ студенттер ғана таңдауға шығады.
  const available = students.filter(
    (student) => !group?.students.some((member) => member.id === student.id),
  );

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const teacherId = data.get("teacher_id");

    setError("");
    try {
      setGroup(
        await api<GroupDetailType>(`/api/groups/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: data.get("name"),
            teacher_id: teacherId ? Number(teacherId) : null,
          }),
        }),
      );
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  async function handleAddExisting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (!email) return;

    setError("");
    setLoading(true);
    try {
      setGroup(
        await api<GroupDetailType>(`/api/groups/${id}/students`, {
          method: "POST",
          body: JSON.stringify({ email }),
        }),
      );
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGroup() {
    if (!group || !confirm(`Удалить группу «${group.name}»?`)) return;

    try {
      await api(`/api/groups/${id}`, { method: "DELETE" });
      navigate("/groups", { replace: true });
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  async function handleRemoveStudent(studentId: number, email: string) {
    if (!confirm(`Убрать ${email} из группы?`)) return;

    setError("");
    try {
      setGroup(
        await api<GroupDetailType>(`/api/groups/${id}/students/${studentId}`, {
          method: "DELETE",
        }),
      );
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header user={user} onLogout={logout} />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {group && (
          <>
            <form onSubmit={handleSave} className="flex flex-wrap gap-2">
              <Input
                type="text"
                name="name"
                defaultValue={group.name}
                placeholder="Название группы"
                required
              />
              {user?.role === "admin" && (
                <Select name="teacher_id" defaultValue={group.teacher?.id ?? ""}>
                  <option value="">Без преподавателя</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name ?? teacher.email}
                    </option>
                  ))}
                </Select>
              )}
              <Button type="submit">Сохранить</Button>
              <button
                type="button"
                onClick={() => void handleDeleteGroup()}
                className="text-xs text-neutral-400 transition-colors duration-150 hover:text-red-600"
              >
                Удалить группу
              </button>
            </form>

            <form onSubmit={handleAddExisting} className="flex flex-wrap gap-2">
              <Select name="email" disabled={available.length === 0}>
                {available.length === 0 && <option value="">Нет свободных студентов</option>}
                {available.map((student) => (
                  <option key={student.id} value={student.email}>
                    {student.full_name ? `${student.full_name} — ` : ""}
                    {student.email}
                  </option>
                ))}
              </Select>
              <Button type="submit" disabled={loading || available.length === 0}>
                {loading ? "Добавление…" : "Добавить"}
              </Button>
            </form>

            {error && <ErrorText>{error}</ErrorText>}

            <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
              {group.students.map((student) => (
                <li key={student.id} className="flex items-center gap-3 px-3 py-2">
                  <span className="w-56 truncate text-sm text-neutral-900">
                    {student.email}
                  </span>
                  <span className="flex-1 truncate text-xs text-neutral-500">
                    {student.full_name ?? "—"}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleRemoveStudent(student.id, student.email)}
                    className="text-xs text-neutral-400 transition-colors duration-150 hover:text-red-600"
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!group && error && <ErrorText>{error}</ErrorText>}
      </main>
    </div>
  );
}
