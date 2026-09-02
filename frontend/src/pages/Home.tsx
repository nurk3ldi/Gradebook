import { Header } from "../components/Header";
import { useSession } from "../lib/session";
import { ROLE_LABELS } from "../lib/types";

export default function Home() {
  const { user, logout } = useSession();

  return (
    <div className="min-h-dvh bg-neutral-50">
      <Header user={user} onLogout={logout} />
      <main className="mx-auto max-w-4xl space-y-1 px-4 py-8">
        {user && (
          <>
            <h1 className="text-lg font-medium text-neutral-900">
              {user.full_name ?? user.email}
            </h1>
            <p className="text-xs text-neutral-500">{ROLE_LABELS[user.role]}</p>
          </>
        )}
      </main>
    </div>
  );
}
