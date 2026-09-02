import { useEffect, useState } from "react";

import { api } from "./lib/api";

export default function App() {
  const [status, setStatus] = useState("…");

  useEffect(() => {
    api<{ status: string }>("/health")
      .then((res) => setStatus(res.status))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 text-neutral-900">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Gradebook</h1>
        <p className="text-sm text-neutral-500">Backend: {status}</p>
      </div>
    </main>
  );
}
