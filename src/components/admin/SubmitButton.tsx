"use client";

import { useFormStatus } from "react-dom";
import { AdminButton } from "./ui";

export function SubmitButton({
  children,
  variant = "primary",
  confirm,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "danger";
  confirm?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <AdminButton
      type="submit"
      variant={variant}
      disabled={pending}
      className={className}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      {pending ? "Saving…" : children}
    </AdminButton>
  );
}
