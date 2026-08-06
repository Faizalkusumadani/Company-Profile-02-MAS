import React from "react";
import Link from "next/link";
import Image from "next/image";
import coreValues from "../../../tools/core";
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
    { label: t("Navigation.about.core"), current: true },
  ];

  return (
    <section id="core">
      <div className="w-full py-20">
        {/* Header & Breadcrumb */}
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
        {/* Main Section */}
        <article className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Big Statement & Logo */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
                    Core <br className="hidden sm:inline" />
                    <span className="text-mas-red">Values.</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md pt-2">
                    {t("About.vision.desc_core")}
                  </p>
                </div>

                {/* Modern Floating Logo (No Card) */}
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 pt-4">
                  <Image
                    src="/logoreddmas.png"
                    alt="Core Values"
                    fill
                    priority
                    className="object-contain transition-all duration-500"
                  />
                </div>
              </div>

              {/* Right Column: Editorial Focus Line List */}
              <div className="lg:col-span-7">
                <div className="relative border-l border-gray-200 pl-6 sm:pl-10 space-y-12">
                  {coreValues.map((item, index) => (
                    <div key={item.key} className="group relative">
                      {/* Active Line Node */}
                      <span className="absolute -left-6.25 sm:-left-10.25 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-300 group-hover:bg-mas-red group-hover:scale-125 transition-all duration-300" />

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-mas-red transition-colors">
                            0{index + 1}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-1.5">
                            <span
                              className={`text-2xl sm:text-6xl ${item.color}`}
                            >
                              {item.letter}
                            </span>
                            <span>{item.title}</span>
                          </h3>
                        </div>

                        <p className="text-base text-gray-600 leading-relaxed pl-7">
                          {t(`About.core.${item.key}`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
