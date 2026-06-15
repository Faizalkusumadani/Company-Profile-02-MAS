import React from "react";
import Link from "next/link";
import Image from "next/image";
import coreValues from "../../../tools/core";
import { EyeOff, Target, CheckCircle } from "lucide-react";
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
    title: "Visi & Misi",
    description: "Visi & Misi PT.Mega adhitama Didirikan",

    openGraph: {
      title: " Mega Adhitama Sejati | Visi & Misi",
      description: "Visi & Misi PT.Mega adhitama Didirikan",
      url: `${siteUrl}/${locale}/Visi & Misi`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/Visi & Misi`,
      languages: {
        "id-ID": `${siteUrl}/id/Visi & Misi`,
        "en-US": `${siteUrl}/en/Visi & Misi`,
      },
    },
  };
}

export default function VisiMisi() {
  const t = useTranslations("About.vision");
  const tNav = useTranslations("Navigation");

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("about.title"), href: "#" },
    { label: tNav("about.vision"), current: true },
  ];
  return (
    <section id="Visi-Misi">
      <div className="w-full py-20">
        {/* Header with Breadcrumb */}
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("about.vision")}
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

        {/* Visi-Misi Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div className="transition-shadow duration-300 rounded-2xl">
                <div className="flex items-center mb-5 space-x-4">
                  <div className="bg-red-700/10 p-4 rounded-full text-red-700 hover:scale-110 transition-transform duration-300">
                    <EyeOff className="w-15 h-15" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {t("title_vision")}
                  </h3>
                </div>

                <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-4">
                  {t("desc_vision")}
                </p>
              </div>

              {/* <!-- Misi --> */}
              <div className="transition-shadow duration-300 rounded-2xl">
                <div className="flex items-center mb-5 space-x-4">
                  <div className="bg-red-700/10 p-4 rounded-full text-red-700 hover:scale-110 transition-transform duration-300">
                    <Target className="w-15 h-15" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {t("title_mision")}
                  </h3>
                </div>

                <ul className="space-y-4 text-left text-body">
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-red-600/60 shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("title_mission_1")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("desc_mission_1")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-red-600/60 shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-base md:text-lg font-semibold mb-2">
                        {t("title_mission_2")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base ">
                        {t("desc_mission_2")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-red-600/60 shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("title_mission_3")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("desc_mission_3")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-red-600/60 shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("title_mission_4")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("desc_mission_4")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-red-600/60 shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("title_mission_5")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("desc_mission_5")}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* CoreValues*/}
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-6xl space-y-24">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-15 items-center">
              <div className="order-1 lg:order-1 ">
                <div className=" py-6 space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-red-700 text-center">
                    Core Values
                  </h2>
                  <p className="text-gray-500 text-center max-w-xl mx-auto">
                    Fondasi budaya kerja kami yang membentuk integritas dan
                    keunggulan perusahaan
                  </p>

                  <div className="relative w-full max-w-sm h-87.5 mx-auto">
                    <Image
                      src="/logoreddmas.png"
                      alt="Core Values"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              {/* <!-- Values List --> */}
              <div className="order-2 lg:order-2 space-y-6">
                {coreValues.map((value, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start group hover:translate-x-2 transition-transform duration-300"
                  >
                    {/* <!-- Letter --> */}
                    <div
                      className={`text-5xl md:text-6xl font-bold ${value.color} leading-none p-7 border-y-2 border-red-700 rounded-full`}
                    >
                      {value.letter}
                    </div>

                    {/* <!-- Content --> */}
                    <div className="flex-1">
                      <h3
                        className={`text-2xl md:text-3xl font-bold ${value.color} mb-2`}
                      >
                        {value.title}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
