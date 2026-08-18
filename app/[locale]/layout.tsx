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
import { siteConfig } from "@/config/site";
import "../globals.css";

// ─── Font ─────────────────────────────────────────────────────────────────────
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

// ─── Static Params (i18n) ─────────────────────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Kunci halaman ini agar hanya locale yang terdaftar yang valid.
export const dynamicParams = false;

// ─── Viewport (dipisah dari metadata sesuai Next.js 14+) ──────────────────────
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

// ─── Metadata Default / Fallback ──────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.shortName,
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        id: "/id",
        "x-default": "/id",
      },
    },

    keywords: [
      "distributor bahan bangunan",
      "material bangunan Banten",
      "toko bangunan Banten",
      "distributor bahan bangunan retail",
      "Mega Adhitama Sejati",
      "retail bahan bangunan Serang",
      "building materials supplier Banten",
    ],

    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

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
      siteName: siteConfig.name,
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

  // Dynamic Schema JSON-LD per Locale — tetap di layout karena ini
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#organization`,
    description: `${siteConfig.description}`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${siteConfig.url}/${locale}`,
    logo: `${siteConfig.url}/logo-mas.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: "+62-21-5835-1648",
    email: "sales@megaadhitamasejati.id",
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.1902626659085,
      longitude: 106.74986318024929,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Banten",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:30",
    },
    sameAs: [
      "https://www.tiktok.com/@megaadhitamasejati?_r=1&_t=ZS-98I1AGVgHHJ",
      "https://www.instagram.com/megaadhitamasejati?igsh=MWIzY2twMTRtNjh0NA%3D%3D",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${poppins.className} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ServiceWorkerRegister />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Pageloader />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
