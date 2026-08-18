import React from "react";
import Image from "next/image";
import Link from "next/link";
import ManagementModal from "@/components/ui/Modal";
import AllModalData from "../../../tools/modalData";
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
    title: t("metadata.managemen_pages"),
    description: t("metadata.managemen_pages_desc"),
  });
}

export default async function Manajemen() {
  const tNav = await getTranslations("Navigation");
  const tMgmt = await getTranslations("About.management");

  const modalData = AllModalData(
    (key) => tMgmt(key),
    (key) => tMgmt.raw(key),
  );

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("about.title"), href: "#" },
    { label: tNav("about.management"), current: true },
  ];

  return (
    <section id="Manajemen">
      <div className="w-full py-20">
        {/* ── Header / Breadcrumb ── */}
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

        {/* ── BOD List ── */}
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            {modalData.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Card per anggota */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start py-12">
                  {/* ── Foto ── */}
                  <div className="flex justify-center md:justify-start">
                    <Image
                      src={item.image}
                      width={400}
                      height={500}
                      className="w-64 h-auto bg-zinc-50 rounded-lg object-cover shadow-lg"
                      alt={item.name}
                    />
                  </div>

                  {/* ── Konten teks ── */}
                  <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                    {/* Nomor urut + nama */}
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl sm:text-3xl font-semibold text-mas-dark mt-0.5 leading-tight">
                        {item.name}
                      </h2>
                      {/* Garis aksen di bawah nama */}
                      <div className="flex items-center gap-1.5 mt-2 justify-center md:justify-start">
                        <span className="block w-6 h-0.5 rounded-full bg-mas-red" />
                        <p className="text-mas-red font-medium text-sm sm:text-base">
                          {item.position}
                        </p>
                      </div>
                    </div>

                    {/* Cuplikan deskripsi */}
                    <div className="space-y-2 text-gray-500 leading-relaxed text-sm sm:text-base line-clamp-4 text-center md:text-left">
                      {item.description.map((desc, i) => (
                        <p key={i}>{desc}</p>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center md:justify-start pt-1">
                      <ManagementModal
                        name={item.name}
                        position={item.position}
                        image={item.image}
                        description={item.description}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Separator antara item (tidak muncul setelah item terakhir) ── */}
                {index < modalData.length - 1 && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-100" />
                    {/* Motif titik di tengah separator */}
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                      <span className="w-1.5 h-1.5 rounded-full bg-mas-red" />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                    </div>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
