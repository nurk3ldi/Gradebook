import type { SelectHTMLAttributes } from "react";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none transition-colors duration-150 focus:border-neutral-900"
    />
  );
}
