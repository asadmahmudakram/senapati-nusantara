import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, ke beranda`}
      className={`brand ${className}`.trim()}
    >
      <Image
        src="/images/logo-senapati.png"
        alt={siteConfig.name}
        width={2040}
        height={770}
        priority
        className="brand__img"
      />
    </Link>
  );
}