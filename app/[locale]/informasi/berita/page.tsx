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
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    title: t("metadata.news_pages"),
    description: t("metadata.news_pages_desc"),
  });
}
export default async function Berita({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const allNews = Allnews(t);

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.info.title"), href: "#" },
    { label: t("Navigation.info.news"), current: true },
  ];

  return (
    <div className="w-full py-20">
      {/* ── Header & Breadcrumb ── */}
      <header className="p-6 sm:p-8 ">
        <div className="mx-auto max-w-6xl">
          {/* Aksen garis merah di atas judul */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="block w-8 h-1 rounded-full bg-mas-red" />
            <span className="block w-4 h-1 rounded-full bg-red-300" />
          </div>

          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm md:text-base text-gray-700">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.current ? (
                      <BreadcrumbPage className="text-mas-red">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        asChild
                        className="text-gray-700 hover:text-mas-red transition-colors"
                      >
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
            {t("Roominformation.news")}{" "}
            <span className="text-mas-red">
              {t("Roominformation.exclusive")}
            </span>
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
