import type { ComponentProps } from "react";
import { Link } from "react-router";

export function LinkButton({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`block rounded-md border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-900 transition-[transform,color,border-color] duration-150 ease-out hover:border-accent hover:text-accent active:scale-[0.97] ${className}`}
    />
  );
}
