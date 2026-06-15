// src/app/[locale]/informasi/kegiatan/page.tsx

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React from "react";
import { Calendar } from "lucide-react";
import Newscarousel from "@/components/ui/newscarousel";
import Allactivities from "../../../tools/all_activities";
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
    title: "Kegiatan",
    description: "Informasi seluruh kegiatan di PT.Mega Adhitama Sejati",

    openGraph: {
      title: " Mega Adhitama Sejati | Kegiatan",
      description: "Informasi seluruh kegiatan di PT.Mega Adhitama Sejati",
      url: `${siteUrl}/${locale}/kegiatan`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/kegiatan`,
      languages: {
        "id-ID": `${siteUrl}/id/kegiatan`,
        "en-US": `${siteUrl}/en/kegiatan`,
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "id" }, { locale: "en" }];
}
export default function Kegiatan() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Roominformation");
  const allActivities = Allactivities(t);

  const newActivities = allActivities.filter((a) => a.isNew);

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("info.title"), href: "#" },
    { label: tNav("info.activities"), current: true },
  ];

  return (
    <section id="kegiatan">
      <div className="w-full py-20">
        {/* ── Header ── */}
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("info.activities")}
            </h1>
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
                          <Link href={item.href || "#"}>{item.label}</Link>
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

        {/* ── Carousel + Sidebar ── */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Carousel */}
              <div className="order-2 lg:order-1 lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Newscarousel slides={allActivities} />
                </div>
              </div>

              {/* Sidebar - Berita Terbaru */}
              <aside className="order-1 lg:order-2 lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
                    <h2 className="text-white text-lg font-bold tracking-wide">
                      {t("activities_news")}
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-200 max-h-auto overflow-y-auto">
                    {newActivities.map((activity, i) => (
                      <Link
                        key={`new-activity-${i}`}
                        href={activity.href}
                        className="p-4 hover:bg-gray-100 transition-colors duration-200 group block"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={activity.image.trim()}
                              alt={activity.title}
                              fill
                              sizes="112px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <h3 className="text-gray-900 font-semibold text-sm leading-snug mb-2 line-clamp-3 group-hover:text-red-700 transition-colors duration-200">
                              {activity.description}
                            </h3>
                            <div className="flex items-center text-gray-400 text-xs mt-auto">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              <time>{activity.date}</time>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Gallery Kegiatan ── */}
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-gray-700 text-2xl lg:text-4xl font-semibold tracking-tight">
              {t("activities")}{" "}
              <span className="text-red-700">{t("exclusive")}</span>
            </h2>
            <div className="h-px bg-gray-200 my-9" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {allActivities.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className="group transition-all duration-300 overflow-hidden transform hover:-translate-y-2 block"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200 rounded-lg">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(50vw - 24px), calc(33vw - 32px)"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-gray-900 font-semibold text-base leading-snug mb-2 line-clamp-3">
                      {activity.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <time>{activity.date}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
