import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

export function Button({ className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:bg-accent-hover active:scale-[0.97] disabled:opacity-60 ${className}`}
    />
  );
}
