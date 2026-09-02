import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97]"
    />
  );
}
