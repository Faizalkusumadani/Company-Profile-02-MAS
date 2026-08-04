import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTranslations } from "next-intl/server";
import { MapPin, Store, Building2, ChevronRight, Building } from "lucide-react";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";
import ZoomableImage from "@/components/ui/Zoomimage";
type Props = {
  params: Promise<{ locale: string }>;
};

// ─── Metadata halaman ini ──────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    title: t("metadata.perusahaan_pages"),
    description: t("metadata.perusahaan_pages_desc"),
  });
}

// ─── Komponen halaman ───────────────────────────────────────────────────────
export default async function Perusahaan({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.about.title"), href: "#" },
    { label: t("Navigation.about.profile"), current: true },
  ];

  const descCompanyRaw = t.raw("About.companyprofile.desc_company");
  const descCompanyParagraphs: string[] = Array.isArray(descCompanyRaw)
    ? descCompanyRaw
    : String(descCompanyRaw)
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

  return (
    <section id="Profil">
      <div className="w-full py-20">
        {/* About - Overlay Style (breadcrumb menyatu di dalam hero) */}
        <div className="relative w-full min-h-105 sm:min-h-120 lg:min-h-160 overflow-hidden">
          <Image
            src="/images/foto-1.jpg"
            fill
            alt="Kantor PT. Mega Adhitama Sejati"
            className="object-cover object-center"
            sizes="100vw"
            priority
            loading="eager"
          />

          {/* Dark overlay untuk keterbacaan teks, lebih gelap di sisi kiri */}
          <div className="absolute inset-0 bg-mas-dark/50" />
          <div className="absolute inset-0 bg-linear-to-r from-mas-dark via-mas-dark/80 to-transparent" />

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
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 text-white">
                  {t.rich("About.companyprofile.header", {
                    red: (chunks) => (
                      <span className="text-mas-red">{chunks}</span>
                    ),
                  })}
                </h1>
                <div className="space-y-3 sm:space-y-4">
                  {descCompanyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Section */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="max-w-3xl mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-mas-dark text-2xl lg:text-4xl font-semibold tracking-wide mb-6">
                {t.rich("About.companyprofile.desc_5", {
                  red: (chunks) => (
                    <span className="text-mas-red">{chunks}</span>
                  ),
                })}
              </h2>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                {t("About.companyprofile.desc_office")}
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12 items-start">
              {/* LEFT: Asymmetric image mosaic */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4 h-105 sm:h-125 lg:h-140">
                  {/* Gambar 1 - Puri Kencana */}
                  <ZoomableImage
                    src="/images/kantor-puri-02.jpeg"
                    alt="Kantor Puri Kencana"
                    className="col-span-3 row-span-2 sm:col-span-3 sm:row-span-2"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
                    title="Puri Kencana"
                    subtitle={t("About.companyprofile.desc_1")}
                  />

                  {/* Gambar 2 - SERVVO Showroom */}
                  <ZoomableImage
                    src="/images/kantor-servvo.jpeg"
                    alt="SERVVO Showroom"
                    className="col-span-2 row-span-1 sm:col-span-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 25vw"
                    title="Serang"
                    subtitle={t("About.companyprofile.desc_3")}
                  />

                  {/* Gambar 3 - Kantor Serang */}
                  <ZoomableImage
                    src="/images/kantor-serang-02.jpeg"
                    alt="Kantor Serang"
                    className="col-span-2 row-span-1 sm:col-span-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 25vw"
                    title="Serang"
                    subtitle={t("About.companyprofile.desc_2")}
                  />
                </div>
              </div>

              {/* RIGHT: Location list */}
              <div className="lg:col-span-5 lg:pt-2">
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      key: "office-1",
                      icon: Building2,
                      title: t("About.companyprofile.desc_1"),
                      city: "Puri Kencana, Jakarta Barat",
                    },
                    {
                      key: "office-2",
                      icon: Building,
                      title: t("About.companyprofile.desc_2"),
                      city: `Serang ${t("About.companyprofile.city_1")}, Banten`,
                    },
                    {
                      key: "office-3",
                      icon: Store,
                      title: t("About.companyprofile.desc_3"),
                      city: `Serang ${t("About.companyprofile.city_1")}, Banten`,
                    },
                  ].map((loc) => {
                    const Icon = loc.icon;
                    return (
                      <div
                        key={loc.key}
                        className="bg-white group relative flex items-start gap-3 sm:gap-5 p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-gray-200/80 hover:border-mas-red/40 hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-mas-red scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                        <div className="shrink-0">
                          <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-mas-red/10 text-mas-red group-hover:bg-mas-red group-hover:text-white transition-colors duration-300">
                            <Icon
                              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                              strokeWidth={2}
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-mas-dark text-sm sm:text-base md:text-lg leading-snug mb-0.5 sm:mb-1">
                            {loc.title}
                          </h3>
                          <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-mas-red/70 shrink-0" />
                            <span className="truncate">{loc.city}</span>
                          </p>
                        </div>

                        <ChevronRight className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-mas-red group-hover:translate-x-1 transition-all duration-300 self-center" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
