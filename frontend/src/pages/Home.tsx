import { Header } from "../components/Header";
import { useSession } from "../lib/session";
import { ROLE_LABELS } from "../lib/types";

export default function Home() {
  const { user, logout } = useSession();

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header user={user} onLogout={logout} />
      <main className="px-4 py-6">
        {user && (
          <p className="text-xs text-neutral-500">{ROLE_LABELS[user.role]}</p>
        )}
      </main>
    </div>
  );
}
