export function ErrorText({ children }: { children: string }) {
  return (
    <p className="text-center text-xs text-red-600 transition-opacity duration-200 starting:opacity-0">
      {children}
    </p>
  );
}
