import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
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
    title: t("metadata.facility_pages"),
    description: t("metadata.facility_pages_desc"),
  });
}
const officeImages = [
  {
    src: "/images/slide-02.webp",
    alt: "Area Bongkar Muatan",
    size: "md:col-span-8 h-[400px]",
  },
  {
    src: "/images/slide-00.webp",
    alt: "Area Pengambilan Produk",
    size: "md:col-span-4 h-[400px]",
  },
  {
    src: "/images/slide-03.webp",
    alt: "Area Penyimpanan Sementara",
    size: "md:col-span-4 h-[320px]",
  },
  {
    src: "/images/slide-05.webp",
    alt: "Area Penyimpanan Produk",
    size: "md:col-span-8 h-[320px]",
  },
  {
    src: "/images/slide-07.webp",
    alt: "Area Kontrol Distribusi",
    size: "md:col-span-4 h-[400px]",
  },
];

export default async function Fasilitas({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.about.title"), href: "#" },
    { label: t("Navigation.about.facility"), current: true },
  ];

  return (
    <section id="mas-warehouse">
      <div className="w-full py-20">
        {/* Header Banner */}
        <header className="px-4 py-8">
          <div className="mx-auto max-w-7xl ">
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

        {/* Kontainer Utama */}
        <article className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl ">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-300 pb-6">
              <div className="space-y-2">
                <span className="text-mas-red uppercase font-light tracking-[0.3em] block text-base">
                  {t("About.facility.tag")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  Mega Adhitama Sejati{" "}
                  <span className="font-extrabold  text-mas-red">
                    {t("About.facility.header")}
                  </span>
                </h2>
              </div>
              <p className="text-smp-muted max-w-md text-xs md:text-sm font-normal leading-relaxed md:text-right">
                {t("About.facility.content")}
              </p>
            </div>

            {/* Galeri Arsitektur / Fasilitas */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {officeImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-xl overflow-hidden border border-gray-300 bg-mas-red/30 group corporate-shadow ${img.size}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1280px) 100vw, 80vw"
                    className="object-cover filter grayscale contrast-105 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-mas-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6">
                    <span className="text-[10px] uppercase font-bold text-mas-red tracking-wider">
                      {t("About.facility.header")}
                    </span>
                    <p className="text-sm font-medium text-white mt-1">
                      {img.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
