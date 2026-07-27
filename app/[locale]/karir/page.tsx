import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight } from "lucide-react";
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
    title: t("metadata.career_pages"),
    description: t("metadata.career_pages_desc"),
  });
}

export default async function Produk({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.career"), current: true },
  ];

  // Pisahkan judul "About" menjadi kata pertama (merah) dan sisanya (putih)
  const aboutTitleWords = t("Career.header").split(" ");
  const aboutTitleFirstWord = aboutTitleWords[0];
  const aboutTitleRest = aboutTitleWords.slice(1).join(" ");
  const descCompanyRaw = t.raw("Career.desc");
  const descCompanyParagraphs: string[] = Array.isArray(descCompanyRaw)
    ? descCompanyRaw
    : String(descCompanyRaw)
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

  return (
    <section id="Karir">
      <div className="w-full pt-20">
        {/* About - Overlay Style (breadcrumb menyatu di dalam hero) */}
        <div className="relative w-full h-screen overflow-hidden">
          <Image
            src="/images/foto-2.png"
            fill
            alt="Kantor PT. Mega Adhitama Sejati"
            className="object-cover object-center"
            sizes="100vw"
            priority
            loading="eager"
          />

          {/* Dark overlay untuk keterbacaan teks, lebih gelap di sisi kiri */}
          <div className="absolute inset-0 bg-mas-dark/50" />
          <div className="absolute inset-0 bg-linear-to-r from-mas-dark via-mas-dark/60 to-transparent" />

          {/* Konten Overlay: breadcrumb menempel di atas, judul & deskripsi di bawah */}
          <div className="relative h-full flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8 sm:py-10 lg:py-14">
            {/* Breadcrumb - bagian atas hero */}
            <div className="mx-auto w-full max-w-7xl px-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="block w-8 h-1 rounded-full bg-mas-red" />
                <span className="block w-4 h-1 rounded-full bg-red-300" />
              </div>
              <Breadcrumb>
                <BreadcrumbList className="text-xs sm:text-sm md:text-base text-white/70">
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
                            className="text-white/70 hover:text-white transition-colors"
                          >
                            <Link href={item.href!}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Judul & Deskripsi - bagian bawah hero */}
            <div className="mx-auto w-full max-w-7xl py-18">
              <div className="w-full max-w-xl text-left px-4">
                <span className="text-mas-red uppercase font-light tracking-[0.3em] text-sm">
                  {t("Career.tag")}
                </span>
                <h1 className="flex flex-wrap gap-x-3 text-3xl sm:text-4xl md:text-[63px] font-extrabold text-mas-dark leading-snug max-w-3xl">
                  <span className="text-mas-red">{aboutTitleFirstWord}</span>
                  <span className="text-white">{aboutTitleRest}</span>
                </h1>
                <div className="space-y-3 sm:space-y-4 mb-8">
                  {descCompanyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <Link
                  href="https://reddmasgroup.com/id/karir"
                  className="inline-flex items-center gap-2 border border-mas-red text-mas-red font-medium px-8 py-4 rounded-full hover:bg-mas-red hover:text-white "
                >
                  {t("Career.cta")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
