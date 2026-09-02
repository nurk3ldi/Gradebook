import { Link } from "react-router";

import { ProfileMenu } from "./ProfileMenu";
import type { User } from "../lib/types";

type Props = {
  user: User | null;
  onLogout: () => void;
};

export function Header({ user, onLogout }: Props) {
  const isStaff = user?.role === "admin" || user?.role === "teacher";

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <Link to="/" className="text-sm font-medium text-neutral-900">
        GradeBook
      </Link>
      <nav className="flex items-center gap-6">
        {isStaff && (
          <Link
            to="/groups"
            className="text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
          >
            Группы
          </Link>
        )}
        {user?.role === "admin" && (
          <Link
            to="/users"
            className="text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
          >
            Пользователи
          </Link>
        )}
        <ProfileMenu user={user} onLogout={onLogout} />
      </nav>
    </header>
  );
}
