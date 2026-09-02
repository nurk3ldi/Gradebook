import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-accent ${className}`}
    />
  );
}
