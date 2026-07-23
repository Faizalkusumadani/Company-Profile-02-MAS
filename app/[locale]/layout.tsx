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

// ─── Schema Markup (JSON-LD) ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}/#organization`,
  name: "PT Mega Adhitama Sejati",
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo-mas.png`,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  description: siteConfig.description,
  telephone: " +62 21-5835-1648",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Jl. Jenderal Ahmad Yani Serang No.30, Cipare, Kec. Serang, Kota Serang, Banten 42117",
    addressLocality: "Serang",
    addressRegion: "Banten",
    addressCountry: "ID",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Banten",
  },
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${siteConfig.name} | Distributor bahan bangunan retail di Serang Banten dan sekitarnya`,
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

  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Distributor bahan bangunan retail di Serang Banten dan sekitarnya`,
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

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Distributor bahan bangunan retail di Serang Banten dan sekitarnya`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  alternates: {
    canonical: siteConfig.url,
    languages: {
      "id-ID": `${siteConfig.url}/id`,
      "en-US": `${siteConfig.url}/en`,
    },
  },

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
      <head>
        {/* Inject Schema Markup ke dalam Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
