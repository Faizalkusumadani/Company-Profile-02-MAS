import type React from "react";
import Pageloader from "@/components/ui/Pageloader";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

// ─── Font ────────────────────────────────────────────────────────────────────
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// ─── Static Params (i18n) ─────────────────────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Site Config (ubah sesuai domain & konten asli) ───────────────────────────
const siteConfig = {
  url: "https://megaadhitamasejati.id/",
  name: "Mega Adhitama Sejati",
  description:
    "Mega Adhitama Sejati merupakan mitra terpercaya dalam penyediaan bahan bangunan berkualitas untuk segmen retail, dengan wilayah layanan utama di Provinsi Banten.",
  ogImage: "/og-image.jpg", // taruh di /public/og-image.jpg (1200×630px)
} as const;

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // Wajib ada agar URL relatif (OG image, canonical) resolve dengan benar
  metadataBase: new URL(siteConfig.url),

  // Template: halaman lain cukup set title pendek, suffix otomatis ditambahkan
  title: {
    default: `${siteConfig.name} | Beranda`,
    template: ` ${siteConfig.name} | %s`,
  },

  description: siteConfig.description,

  keywords: [
    "bahan bangunan",
    "material bangunan",
    "toko bangunan Banten",
    "distributor bangunan",
    "Mega Adhitama Sejati",
    "retail bangunan",
  ],

  authors: [{ name: siteConfig.name, url: siteConfig.url }],

  creator: siteConfig.name,

  // Izinkan mesin pencari mengindex & mengikuti link
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph — tampil saat link di-share di WhatsApp, Facebook, dll.
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Beranda`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Logo dan banner ${siteConfig.name}`,
        type: "image/jpeg",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Beranda`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  // Canonical — cegah duplicate content antara /id dan /en
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "id-ID": `${siteConfig.url}/id`,
      "en-US": `${siteConfig.url}/en`,
    },
  },

  // Favicon & icon set (Next.js baca dari /app/icon.* otomatis,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // manifest.json untuk PWA / "Add to Home Screen"
  manifest: "/site.webmanifest",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Pageloader />
          <Header />
          <main className="bg-white min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
