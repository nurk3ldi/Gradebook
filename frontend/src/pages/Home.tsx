import { Layout } from "../components/Layout";
import { useSession } from "../lib/session";
import { ROLE_LABELS } from "../lib/types";

export default function Home() {
  const { user, logout } = useSession();
  const name = user?.full_name ?? user?.email;

  return (
    <Layout
      user={user}
      onLogout={logout}
      title={name ? `Привет, ${name}` : "GradeBook"}
      subtitle={user ? ROLE_LABELS[user.role] : undefined}
    >
      {null}
    </Layout>
  );
}
