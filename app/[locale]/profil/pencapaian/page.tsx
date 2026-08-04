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
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";

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
    title: t("metadata.pencapaian_pages"),
    description: t("metadata.pencapaian_pages_desc"),
  });
}
export default async function Pencapaian({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.about.title"), href: "#" },
    { label: t("Navigation.about.achievement"), current: true },
  ];

  return (
    <section id="Pencapaian">
      <div className="w-full py-20">
        {/* Hero - dark themed, foto perusahaan membaur dari kanan */}
        <div className="relative w-full min-h-105 sm:min-h-120 lg:min-h-160 overflow-hidden bg-mas-dark/10 ">
          <Image
            src="/piala2.png"
            alt="Profil Perusahaan"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          {/* Gradasi gelap dari kiri agar teks tetap terbaca */}
          <div className="absolute inset-0 bg-linear-to-r from-mas-dark/60  to-mas-dark" />

          <div className="relative z-10  px-6 sm:px-10 lg:px-16 py-8 sm:py-10 lg:py-14 ">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                {/* Aksen garis merah di atas judul */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="block w-8 h-1 rounded-full bg-mas-red" />
                  <span className="block w-4 h-1 rounded-full bg-red-300" />
                </div>

                <Breadcrumb>
                  <BreadcrumbList className="text-xs sm:text-sm md:text-base">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {item.current ? (
                            <BreadcrumbPage className="text-mas-red">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link
                                href={item.href!}
                                className="text-white/60 hover:text-mas-red transition-colors"
                              >
                                {item.label}
                              </Link>
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

              <div className="ml-auto max-w-2xl text-right py-20 md:py-40">
                <h2 className="text-white text-2xl lg:text-4xl font-semibold tracking-wide mb-6">
                  {t.rich("About.achievement.header_01", {
                    red: (chunks) => (
                      <span className="text-mas-red">{chunks}</span>
                    ),
                  })}
                </h2>

                <p className="mt-6 text-sm md:text-lg text-white/60 leading-relaxed">
                  {t("About.achievement.desc_achievement")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* archivement */}
        <article className="px-4 py-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-mas-dark text-2xl lg:text-4xl font-semibold tracking-wide mb-6">
              {t.rich("About.achievement.header_02", {
                red: (chunks) => <span className="text-mas-red">{chunks}</span>,
              })}
            </h2>
            <div className="h-px bg-gray-300 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Allarchivement.map((archivement) => (
                <a
                  key={archivement.id}
                  href={archivement.href}
                  className="group transition-all duration-300 overflow-hidden transform hover:-translate-y-2 block "
                >
                  <div className="relative h-66 sm:h-68 md:h-72 overflow-hidden bg-gray-200 border-2 border-gray-200">
                    <Image
                      src={archivement.image}
                      alt={archivement.title}
                      width={350}
                      height={250}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay tipis biar background putih sertifikat gak silau, memudar saat hover */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />
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
        </article>
      </div>
    </section>
  );
}
