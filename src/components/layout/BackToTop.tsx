"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER = 400; // px dari atas halaman

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > SHOW_AFTER);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <a
      href="#header"
      className={`back-to-top${show ? " is-visible" : ""}`}
      onClick={toTop}
      aria-label="Kembali ke atas halaman"
      tabIndex={show ? 0 : -1}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 15l6-6 6 6" />
      </svg>
    </a>
  );
}