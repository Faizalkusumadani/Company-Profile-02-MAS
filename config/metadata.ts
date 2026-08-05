// config/metadata.ts
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type BuildPageMetadataArgs = {
  locale: string;
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
};

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  image,
  type = "website",
}: BuildPageMetadataArgs): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;
  const isEn = locale === "en";
  const rawImage = image ?? siteConfig.ogImage;
  const ogImage = rawImage.startsWith("http")
    ? rawImage
    : `${siteConfig.url}${rawImage}`;

  // 1. Format judul halaman di sini
  const fullTitle = `${siteConfig.shortName} | ${title}`;

  return {
    // 2. Gunakan fullTitle untuk title biasa, OG, dan Twitter
    title: fullTitle,
    description,

    alternates: {
      canonical: url,
      languages: {
        "id-ID": `${siteConfig.url}/id${path}`,
        "en-US": `${siteConfig.url}/en${path}`,
      },
    },

    openGraph: {
      title: fullTitle,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: isEn ? "en_US" : "id_ID",
      alternateLocale: isEn ? ["id_ID"] : ["en_US"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
