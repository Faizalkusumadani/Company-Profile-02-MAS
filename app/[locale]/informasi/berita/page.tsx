// src/app/[locale]/informasi/berita/page.tsx

import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import Allnews from "../../../tools/all_news";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

const siteUrl = "https://megaadhitamasejati.id/";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Berita",
    description: "Informasi Seluruh berita di PT Mega Adhitama Sejati",

    openGraph: {
      title: " Mega Adhitama Sejati | Berita",
      description: "Informasi Seluruh berita di PT Mega Adhitama Sejati",
      url: `${siteUrl}/${locale}/berita`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/berita`,
      languages: {
        "id-ID": `${siteUrl}/id/berita`,
        "en-US": `${siteUrl}/en/berita`,
      },
    },
  };
}

export default function Berita() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Roominformation");
  const allNews = Allnews(t);

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("info.title"), href: "#" },
    { label: tNav("info.news"), current: true },
  ];

  return (
    <div className="w-full py-20">
      {/* ── Header & Breadcrumb ── */}
      <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
        <div className="mx-auto max-w-6xl">
          {/* Aksen garis merah di atas judul */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="block w-8 h-1 rounded-full bg-red-700" />
            <span className="block w-4 h-1 rounded-full bg-red-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
            {tNav("info.news")}
          </h2>
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm md:text-base lg:text-lg">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.current ? (
                      <BreadcrumbPage className="text-red-700">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href!}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* ── Daftar Berita ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-gray-700 text-2xl font-semibold tracking-tight">
            {t("news")} <span className="text-red-700">{t("exclusive")}</span>
          </h2>
          <div className="h-px bg-gray-200 my-9" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {allNews.map((news) => (
              <Link
                key={news.id}
                href={news.href}
                className="group transition-all duration-300 overflow-hidden transform hover:-translate-y-2 block"
              >
                {/* Gambar */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200 rounded-lg">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(50vw - 24px), calc(33vw - 32px)"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Teks */}
                <div className="mt-4">
                  <h3 className="text-gray-900 font-semibold text-base leading-snug mb-2 line-clamp-3">
                    {news.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                    {news.description}
                  </p>
                  <div className="flex items-center text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <time dateTime={news.date}>{news.date}</time>{" "}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
