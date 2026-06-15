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
    title: "Tentang Perusahaan ",
    description:
      "Tentang Perusaahaan Mega Adhitama Sejati yang didirikan pada tahun 2012",

    openGraph: {
      title: " Mega Adhitama Sejati | Tentang Perusahaan ",
      description:
        "Tentang Perusaahaan Mega Adhitama Sejati yang didirikan pada tahun 2012",
      url: `${siteUrl}/${locale}/tentang perusahaan`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/tentang perusahaan`,
      languages: {
        "id-ID": `${siteUrl}/id/tentang perusahaan`,
        "en-US": `${siteUrl}/en/tentang perusahaan`,
      },
    },
  };
}

export default function Perusahaan() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("About.companyprofile");

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("about.title"), href: "#" },
    { label: tNav("about.profile"), current: true },
  ];
  return (
    <section id="Profil">
      <div className="w-full py-20">
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("about.profile")}
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

        {/* About */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
              <div className="order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <div className="aspect-4/3 relative">
                    <Image
                      src="/images/foto 1.jpg"
                      fill
                      alt="Kantor PT. Mega Adhitama Sejati"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                      priority
                      loading="eager"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="order-2 lg:order-1 space-y-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-700 mb-2">
                    {t("about_company")}
                  </h2>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                  {t("desc_company")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Office Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-linear-to-b from-white to-gray-50">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
              <div className="order-1 lg:order-1">
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {/* Image 1 - SERVVO */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg group">
                    <div className="aspect-4/3 relative">
                      <Image
                        src="/images/kantor-servvo.jpeg"
                        alt="SERVVO Showroom"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm px-3 py-1 bg-red-700 rounded-full">
                        SERVVO Showroom
                      </span>
                    </div>
                  </div>

                  {/* Image 2 - Puri Kencana */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg group">
                    <div className="aspect-4/3 relative">
                      <Image
                        src="/images/kantor-puri.jpg"
                        alt="Kantor Puri Kencana"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm px-3 py-1 bg-red-700 rounded-full">
                        Kantor Pusat
                      </span>
                    </div>
                  </div>

                  {/* Image 3 - Serang */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg group">
                    <div className="aspect-4/3 relative">
                      <Image
                        src="/images/kantor-serang.jpeg"
                        alt="Kantor Serang"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm px-3 py-1 bg-red-700 rounded-full">
                        Kantor Serang
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-2 lg:order-2 space-y-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-700 space-x-2">
                    MAS <span className="text-red-700">Office</span>
                  </h2>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                  {t("desc_office")}
                </p>

                {/* Location Cards */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">
                        {t("desc_1")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Puri Kencana, Jakarta Barat
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">
                        {t("desc_2")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Serang {t("city_1")} , Banten
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">
                        {t("desc_3")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Serang {t("city_1")} , Banten
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wharehouse section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-700">
                MAS <span className="text-red-700">Warehouse</span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed mb-10">
                {t("desc_warehouse")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="md:col-span-2 relative overflow-hidden rounded-xl shadow-xl group">
                <div className="aspect-3/1 relative">
                  <Image
                    src="/images/slide-02.png"
                    alt="Warehouse Alam Sutera - Tangerang"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl group">
                <div className="aspect-3/2 relative">
                  <Image
                    src="/images/slide-00.jpeg"
                    alt="Warehouse Alamsutra - Detail 1"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (min-width: 769px) 33vw"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-6 md:col-span-2">
                <div className="relative overflow-hidden rounded-xl shadow-xl group">
                  <div className="aspect-video relative">
                    <Image
                      src="/images/slide-03.png"
                      alt="Warehouse Alamsutra"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl shadow-xl group">
                  <div className="aspect-video relative">
                    <Image
                      src="/images/slide-05.png"
                      alt="Gudang"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl shadow-xl group">
                <div className="aspect-video relative">
                  <Image
                    src="/images/slide-07.jpg"
                    alt="Aktivitas di Gudang"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
