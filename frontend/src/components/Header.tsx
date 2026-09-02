import { Link } from "react-router";

import type { User } from "../lib/types";

type Props = {
  user: User | null;
  onLogout: () => void;
};

export function Header({ user, onLogout }: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-neutral-900">
          GradeBook
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/users"
            className="text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
          >
            Пользователи
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-xs text-neutral-500">{user.email}</span>}
        <button
          type="button"
          onClick={onLogout}
          className="text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
