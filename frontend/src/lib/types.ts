export type Role = "admin" | "teacher" | "student";

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Администратор",
  teacher: "Преподаватель",
  student: "Студент",
};

export type Group = {
  id: number;
  name: string;
  teacher: User | null;
  students_count: number;
  created_at: string;
};

export type GroupDetail = Group & { students: User[] };
