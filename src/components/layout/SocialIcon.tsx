import type { ReactNode } from "react";

const common = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

const ICONS: Record<string, ReactNode> = {
  facebook: (
    <svg {...common} fill="currentColor">
      <path d="M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
    </svg>
  ),
  instagram: (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg {...common} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6 5h12a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4zM10 9.2v5.6l5-2.8z"
      />
    </svg>
  ),
  tiktok: (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.4 2.4 2 4 4.5 4.2" />
    </svg>
  ),
};

export default function SocialIcon({ name }: { name: string }) {
  return ICONS[name.toLowerCase()] ?? <span aria-hidden="true">{name.charAt(0)}</span>;
}