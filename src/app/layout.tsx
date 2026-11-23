import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { siteConfig } from "@/data/site";
import Navbar from "@/components/layout/Navbar";
import NavMenuBehavior from "@/components/layout/NavMenuBehavior";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

const display = localFont({
  src: "./fonts/Hawkes-MediumNarrow.ttf",
  variable: "--font-display",
  weight: "500",
  display: "swap",
});

const accent = localFont({
  src: "./fonts/HaydonBrush_PERSONAL_USE.ttf",
  variable: "--font-accent",
  weight: "400",
  display: "swap",
});

const body = localFont({
  src: "./fonts/PublicSans-Variable.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6a0c0d",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "berita Indonesia",
    "portal berita",
    "headline terbaru",
    "nasional",
    "daerah",
    "politik",
    "ekonomi",
    "olahraga",
    "teknologi",
    "hiburan",
    "kabar terkini",
  ],
  category: "news",
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/ICON-SN.png",
        width: 2040,
        height: 770,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/ICON-SN.png"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/ICON-SN.png",
    shortcut: "/images/ICON-SN.png",
    apple: "/images/ICON-SN.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${accent.variable} ${body.variable}`}
    >
      <body>
        {/* <Splash /> */}
        <a className="skip-link" href="#konten">
          Lewati ke konten
        </a>
        <Navbar />
        <main id="konten">{children}</main>
        <Footer />
        <NavMenuBehavior />
        <BackToTop />
      </body>
    </html>
  );
}
