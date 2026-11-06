"use client";

import { useState } from "react";
import { siteConfig } from "@/data/site";

/**
 * Layar pembuka singkat, hanya saat halaman dimuat penuh (bukan saat pindah halaman).
 * Tidak memblokir klik dan hilang sendiri. Hapus <Splash /> dari layout.tsx jika tidak ingin dipakai.
 */
export default function Splash() {
  const [done, setDone] = useState(false);
  if (done) return null;

  return (
    <div
      className="splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setDone(true);
      }}
    >
      <span className="splash__mark">{siteConfig.name}</span>
    </div>
  );
}