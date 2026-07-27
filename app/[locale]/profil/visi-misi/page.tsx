import React from "react";
import Link from "next/link";
import { EyeOff, Target, CheckCircle } from "lucide-react";
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
    title: t("metadata.vision_pages"),
    description: t("metadata.vision_pages_desc"),
  });
}

export default async function VisiMisi({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.about.title"), href: "#" },
    { label: t("Navigation.about.vision"), current: true },
  ];

  return (
    <section id="Visi-Misi">
      <div className="w-full py-20">
        {/* Header with Breadcrumb */}
        <header className="px-4 py-8">
          <div className="mx-auto max-w-7xl">
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

        {/* Visi-Misi Section */}
        <article className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-8 mb-12 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 leading-snug">
                <span className="text-mas-red">
                  {t("About.vision.header")}{" "}
                </span>
                <span className="text-mas-dark">
                  {t("About.vision.header_01")}
                </span>
              </h1>
              <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-4">
                {" "}
                {t("About.vision.header_desc")}{" "}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div className="transition-shadow duration-300 rounded-2xl">
                <div className="flex items-center mb-5 space-x-4">
                  <div className="bg-mas-red/10 p-4 rounded-full text-mas-red hover:scale-110 transition-transform duration-300">
                    <EyeOff className="w-15 h-15" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-semibold text-mas-dark">
                    {t("About.vision.title_vision")}
                  </h3>
                </div>

                <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-4">
                  {t("About.vision.desc_vision")}
                </p>
              </div>

              {/* <!-- Misi --> */}
              <div className="transition-shadow duration-300 rounded-2xl">
                <div className="flex items-center mb-5 space-x-4">
                  <div className="bg-mas-red/10 p-4 rounded-full text-mas-red hover:scale-110 transition-transform duration-300">
                    <Target className="w-15 h-15" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-semibold text-mas-dark">
                    {t("About.vision.title_mision")}
                  </h3>
                </div>

                <ul className="space-y-4 text-left text-body">
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-mas-red shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("About.vision.title_mission_1")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("About.vision.desc_mission_1")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-mas-red shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-base md:text-lg font-semibold mb-2">
                        {t("About.vision.title_mission_2")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base ">
                        {t("About.vision.desc_mission_2")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-mas-red shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("About.vision.title_mission_3")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("About.vision.desc_mission_3")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-mas-red shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("About.vision.title_mission_4")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("About.vision.desc_mission_4")}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle
                      className="w-6 h-6 text-mas-red shrink-0 me-2.5 mt-1"
                      aria-hidden="true"
                    />
                    <div className="flex space-x-2 flex-col">
                      <p className="text-gray-700 text-sm md:text-lg font-semibold mb-2">
                        {t("About.vision.title_mission_5")}
                      </p>
                      <span className="text-gray-500 text-sm md:text-base">
                        {t("About.vision.desc_mission_5")}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
