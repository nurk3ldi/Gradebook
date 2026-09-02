import type { ComponentProps } from "react";
import { Link } from "react-router";

export function LinkButton(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-900 transition-transform duration-150 ease-out active:scale-[0.97]"
    />
  );
}
