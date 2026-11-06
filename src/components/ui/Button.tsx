import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  variant?: "solid" | "ghost";
  className?: string;
  children: ReactNode;
  /** Jika diisi, tampil sebagai tautan internal. */
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export default function Button({ variant = "solid", className, children, href, ...rest }: Props) {
  const classes = ["btn", variant === "ghost" ? "btn-ghost" : "", className ?? ""].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}