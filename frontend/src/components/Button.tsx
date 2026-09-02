import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:bg-accent-hover active:scale-[0.97] disabled:opacity-60"
    />
  );
}
