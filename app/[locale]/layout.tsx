import type React from "react";
import Pageloader from "@/components/ui/Pageloader";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import ServiceWorkerRegister from "@/components/ui/ServiceWorkerRegister";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

// ─── Font ─────────────────────────────────────────────────────────────────────
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// ─── Static Params (i18n) ─────────────────────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Site Config ──────────────────────────────────────────────────────────────
const siteConfig = {
  url: "https://megaadhitamasejati.id",
  name: "Mega Adhitama Sejati",
  description:
    "Mega Adhitama Sejati merupakan mitra terpercaya dalam penyediaan bahan bangunan berkualitas untuk segmen retail, dengan wilayah layanan utama di Provinsi Banten.",
  ogImage: "/og-image.png",
} as const;

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${siteConfig.name} | Distributor Bahan Bangunan di wilayah Banten `,
    template: `${siteConfig.name} | %s`,
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

  // ── Open Graph ─────────────────────────────────────────────────────────────
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
        alt: `Banner ${siteConfig.name}`,
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Beranda`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  // ── Canonical & hreflang ────────────────────────────────────────────────────
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "id-ID": `${siteConfig.url}/id`,
      "en-US": `${siteConfig.url}/en`,
    },
  },

  // ── PWA Manifest ────────────────────────────────────────────────────────────
  manifest: "/manifest.webmanifest",
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
        <ServiceWorkerRegister />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Pageloader />
          <Header />
          <main className="bg-zinc-100 min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
