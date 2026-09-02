import { Link, NavLink } from "react-router";

import { ProfileMenu } from "./ProfileMenu";
import type { User } from "../lib/types";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-xs text-accent"
    : "text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900";

export function Header({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) {
  const isStaff = user?.role === "admin" || user?.role === "teacher";

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <Link to="/" className="text-sm font-medium text-neutral-900">
        GradeBook
      </Link>
      <nav className="flex items-center gap-6">
        {isStaff && (
          <NavLink to="/groups" className={linkClass}>
            Группы
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/users" className={linkClass}>
            Пользователи
          </NavLink>
        )}
        <ProfileMenu user={user} onLogout={onLogout} />
      </nav>
    </header>
  );
}
