"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Menutup dropdown menu desktop setelah tautan di dalamnya diklik. Tidak menampilkan apa pun. */
export default function NavMenuBehavior() {
  const pathname = usePathname();

  // Ganti halaman: lepaskan fokus supaya :focus-within tidak menahan dropdown
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    if (active?.closest(".main-nav")) active.blur();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest(".main-nav .sub a");
      if (!link) return;
      link.closest(".nav-top")?.classList.add("is-closed");
      (document.activeElement as HTMLElement | null)?.blur();
    };

    // Dropdown boleh terbuka lagi setelah kursor meninggalkan menu itu
    const onOver = (e: MouseEvent) => {
      document.querySelectorAll(".nav-top.is-closed").forEach((el) => {
        if (!el.contains(e.target as Node)) el.classList.remove("is-closed");
      });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return null;
}