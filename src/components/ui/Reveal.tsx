"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/**
 * Memunculkan konten saat masuk layar. Konten yang sudah terlihat saat halaman dibuka
 * tidak disembunyikan, dan pengguna dengan reduced-motion tidak melihat efek apa pun.
 * Pakai seperlunya, bukan di setiap bagian.
 */
export default function Reveal({ children, as: Tag = "div", className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setPending(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPending(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as ElementType;
  const classes = ["reveal", pending ? "reveal-pending" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <Component ref={ref} className={classes}>
      {children}
    </Component>
  );
}