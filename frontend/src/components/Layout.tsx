import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { ProfileMenu } from "./ProfileMenu";
import type { User } from "../lib/types";

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  );
}

function GroupsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.4" />
      <path d="M18 19a5.5 5.5 0 0 0-2-4" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
    </svg>
  );
}

function LogoutIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="m17 8 4 4-4 4" />
      <path d="M21 12H10" />
    </svg>
  );
}

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
    isActive
      ? "bg-ink text-white"
      : "text-muted hover:bg-canvas hover:text-ink",
  ].join(" ");

type Props = {
  user: User | null;
  onLogout: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Layout({ user, onLogout, title, subtitle, children }: Props) {
  const isStaff = user?.role === "admin" || user?.role === "teacher";

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="sticky top-0 flex h-dvh w-16 shrink-0 flex-col border-r border-line bg-surface px-3 py-6 md:w-60 md:px-4">
        <span className="mb-8 truncate px-1 text-lg font-bold text-ink">
          <span className="md:hidden">G</span>
          <span className="hidden md:inline">GradeBook</span>
        </span>

        <p className="mb-2 hidden px-3 text-xs font-medium text-muted md:block">
          Меню
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={navItemClass}>
            <HomeIcon className="size-5 shrink-0" />
            <span className="hidden md:inline">Главная</span>
          </NavLink>
          {isStaff && (
            <NavLink to="/groups" className={navItemClass}>
              <GroupsIcon className="size-5 shrink-0" />
              <span className="hidden md:inline">Группы</span>
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/users" className={navItemClass}>
              <UsersIcon className="size-5 shrink-0" />
              <span className="hidden md:inline">Пользователи</span>
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink"
        >
          <LogoutIcon className="size-5 shrink-0" />
          <span className="hidden md:inline">Выйти</span>
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-6 md:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-ink">{title}</h1>
            {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
          </div>
          <ProfileMenu user={user} onLogout={onLogout} />
        </header>

        <main className="min-w-0 space-y-5 px-5 pb-10 md:px-8">{children}</main>
      </div>
    </div>
  );
}
