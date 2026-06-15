import Link from "next/link";
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
    title: "Karir",
    description:
      "Temukan informasi lowongan kerja dan job fair terbaru di Mega Adhitama Sejati. Bergabunglah bersama kami di industri bahan bangunan Banten.",

    openGraph: {
      title: " Mega Adhitama Sejati | Karir",
      description:
        "Temukan informasi lowongan kerja dan job fair terbaru di Mega Adhitama Sejati.",
      url: `${siteUrl}/${locale}/karir`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/karir`,
      languages: {
        "id-ID": `${siteUrl}/id/karir`,
        "en-US": `${siteUrl}/en/karir`,
      },
    },
  };
}

export default function Karir() {
  const tabout = useTranslations("Home.About");
  const t = useTranslations("Career");
  const tNav = useTranslations("Navigation");

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("career"), current: true },
  ];

  return (
    <section id="karir">
      <div className="w-full py-20">
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("career")}
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
        <div className="px-4 py-13 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6 py-6 text-center">
              <h2 className="text-gray-900 font-extrabold text-3xl sm:text-4xl md:text-5xl">
                {t("title_karir")}
              </h2>
              <p className="text-gray-500 font-normal text-base">
                {t("karir_desc")}
              </p>
              <Link
                href="/profil/perusahaan"
                className="inline-flex items-center gap-2 border border-red-700 text-red-700 font-medium px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group"
              >
                {tabout("ctaabout")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
