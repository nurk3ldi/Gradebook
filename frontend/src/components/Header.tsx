type Props = {
  email?: string;
  onLogout: () => void;
};

export function Header({ email, onLogout }: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <span className="text-sm font-medium text-neutral-900">GradeBook</span>
      <div className="flex items-center gap-4">
        {email && <span className="text-xs text-neutral-500">{email}</span>}
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
