import type React from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import Pageloader from "@/components/ui/Pageloader";
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
  variable: "--font-poppins",
});

// ─── Static Params (i18n) ─────────────────────────────────────────────────────
// Menghasilkan semua locale secara statis di build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Kunci halaman ini agar hanya locale yang terdaftar yang valid.
// Akses locale lain (mis. /fr) akan langsung 404 di level routing,
export const dynamicParams = false;

// ─── Site Config ──────────────────────────────────────────────────────────────
const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://megaadhitamasejati.id",
  name: "PT Mega Adhitama Sejati",
  shortName: "Mega Adhitama Sejati",
  description: {
    id: "Mega Adhitama Sejati merupakan mitra terpercaya dalam penyediaan bahan bangunan berkualitas untuk segmen retail, dengan wilayah layanan utama di Provinsi Banten.",
    en: "Mega Adhitama Sejati is a trusted partner in providing quality building materials for the retail segment, with a primary service area in Banten Province.",
  },
  ogImage: "/og-image.png",
  themeColor: "#18181b",
} as const;

// ─── Viewport (dipisah dari metadata sesuai Next.js 14+) ──────────────────────
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

// ─── Dynamic Metadata Generator ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const description = isEn
    ? siteConfig.description.en
    : siteConfig.description.id;

  const titleString = isEn
    ? `${siteConfig.shortName} | Retail Building Materials Distributor with a primary service area in Banten Province.`
    : `${siteConfig.shortName} | Distributor Bahan Bangunan Retail dengan wilayah layanan utama di Provinsi Banten`;

  return {
    metadataBase: new URL(siteConfig.url),

    title: {
      default: titleString,
      template: `%s | ${siteConfig.shortName}`,
    },

    description,

    applicationName: siteConfig.name,

    keywords: [
      "bahan bangunan",
      "material bangunan Banten",
      "toko bangunan Banten",
      "distributor bahan bangunan",
      "Mega Adhitama Sejati",
      "retail bahan bangunan Serang",
      "building materials supplier Banten",
    ],

    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    // Alternates dinamis untuk SEO i18n yang bersih
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        id: `${siteConfig.url}/id`,
        en: `${siteConfig.url}/en`,
        "x-default": `${siteConfig.url}/id`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "id_ID",
      alternateLocale: isEn ? ["id_ID"] : ["en_US"],
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: titleString,
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Official Banner`,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      images: [siteConfig.ogImage],
    },

    icons: {
      icon: [{ url: "/favicon.ico", sizes: "32x32" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    manifest: "/manifest.webmanifest",

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

// ─── Layout Component ─────────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  // Dynamic Schema JSON-LD per Locale
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${siteConfig.url}/${locale}`,
    logo: `${siteConfig.url}/logo-mas.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description:
      locale === "en" ? siteConfig.description.en : siteConfig.description.id,
    telephone: "+62-21-5835-1648",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Grand Puri Niaga Blok K6 No. 5S, Jl. Puri Kencana, Kembangan",
      addressLocality: "Jakarta Barat",
      addressRegion: "DKI Jakarta",
      postalCode: "11610",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Banten",
    },
    sameAs: [
      "https://www.tiktok.com/@megaadhitamasejati?_r=1&_t=ZS-98I1AGVgHHJ",
      "https://www.instagram.com/megaadhitamasejati?igsh=dXQyb3o3c25sM3Z4",
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
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
          <main className="bg-stone-50 min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
