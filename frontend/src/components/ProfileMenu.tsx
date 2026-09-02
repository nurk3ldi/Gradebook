import { useEffect, useRef, useState } from "react";

import { ROLE_LABELS, type User } from "../lib/types";

type Props = {
  user: User | null;
  onLogout: () => void;
};

export function ProfileMenu({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Профиль"
        className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform duration-150 ease-out hover:text-neutral-900 active:scale-[0.94]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="size-4"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-52 origin-top-right rounded-md border border-neutral-200 bg-white p-1 shadow-sm transition duration-150 ease-out starting:scale-95 starting:opacity-0">
          <div className="px-2 py-1.5">
            <p className="truncate text-xs text-neutral-900">{user?.email}</p>
            {user && (
              <p className="text-xs text-neutral-500">{ROLE_LABELS[user.role]}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded px-2 py-1.5 text-left text-xs text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
