import type { ReactNode } from "react";

type Props = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Тізім карточкасы — ішкі шеткі бос орынсыз. */
  flush?: boolean;
};

export function Card({ title, action, children, flush }: Props) {
  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-medium text-neutral-900">{title}</h2>
          {action}
        </header>
      )}
      <div className={flush ? "" : "p-4"}>{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: string }) {
  return <p className="px-4 py-6 text-center text-xs text-neutral-500">{children}</p>;
}
