import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import Allarchivement from "../../../tools/archivement";
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
    title: "Pencapaian",
    description:
      "Informasi seputar pencapaian dan sertifikasi PT.Mega Adhitama Sejati",

    openGraph: {
      title: " Mega Adhitama Sejati | Pencapaian",
      description:
        "Informasi seputar pencapaian dan sertifikasi PT.Mega Adhitama Sejati",
      url: `${siteUrl}/${locale}/pencapaian`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/pencapaian`,
      languages: {
        "id-ID": `${siteUrl}/id/pencapaian`,
        "en-US": `${siteUrl}/en/pencapaian`,
      },
    },
  };
}

export default function Pencapaian() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("About.achievement");

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("about.title"), href: "#" },
    { label: tNav("about.achievement"), current: true },
  ];

  return (
    <section id="Pencapaian">
      <div className="w-full py-20">
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("about.achievement")}
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

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6">
              <h2 className="text-gray-700 text-2xl md:text-4xl font-medium">
                {t("achievement")} &
                <span className="text-red-700"> {t("awards")}</span>
              </h2>
              <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
                {t("desc_achievement")}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-4xl overflow-hidden bg-gray-200 h-75 md:h-125">
              <Image
                src="/Piala2.png"
                width={900}
                height={700}
                alt="Piala"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              {/* <!-- Overlay Teaser  --> */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6">
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                  {t("desc_achievement_1")}
                </h3>
                <p className="text-white text-sm md:text-base opacity-90 mb-3">
                  Dipost pada tanggal 2 Maret 2023
                </p>
                <a
                  href="../about/detailpencapaian"
                  className="text-red-400 hover:text-red-300 underline transition-colors"
                >
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* archivement */}
        <div className="px-4 py-10 ">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-gray-700 text-2xl lg:text-4xl font-semibold tracking-wide">
              Sertifikasi
            </h2>
            <div className="h-px bg-gray-300 dark:bg-gray-700 my-9"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Allarchivement.map((archivement) => (
                <a
                  key={archivement.id}
                  href={archivement.href}
                  className="group transition-all duration-300 overflow-hidden transform hover:-translate-y-2 block "
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-200 border-2 border-gray-200">
                    <Image
                      src={archivement.image}
                      alt={archivement.title}
                      width={350}
                      height={250}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-gray-900 font-semibold text-sm leading-snug mb-2 line-clamp-3">
                      {archivement.title}
                    </h4>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="me-1.5" />
                      <span>{archivement.date}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
