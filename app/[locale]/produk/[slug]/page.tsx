import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import TabsCustom from "@/components/ui/Tabscostum";
import produkDetailList from "../../../tools/produkdetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";

export async function generateStaticParams() {
  const locales = ["id", "en"];
  return locales.flatMap((locale) =>
    produkDetailList.map((p) => ({ locale, slug: p.slug })),
  );
}
// Generate Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const produk = produkDetailList.find((p) => p.slug === slug);
  if (!produk) return { title: "Produk tidak ditemukan" };

  const t = await getTranslations({ locale, namespace: "Products" });

  return buildPageMetadata({
    locale,
    title: produk.namaBrand,
    description: t(produk.descKey),
    path: `/produk/${slug}`,
    image: encodeURI(produk.gambarUtama),
  });
}

// Komponen utama — tambahkan await params
export default async function ProdukDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const produk = produkDetailList.find((p) => p.slug === slug);
  if (!produk) notFound();

  const tNav = await getTranslations({ locale, namespace: "Navigation" });
  const t = await getTranslations({ locale, namespace: "Products" });

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("product"), href: "/produk" },
    { label: produk!.namaBrand, current: true },
  ];

  return (
    <section id={produk!.slug}>
      <div className="w-full py-20">
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

        <div className="px-4 sm:px-6 lg:px-8 py-15">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
              <div className="order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden group">
                  <div className="aspect-4/4 relative">
                    <Image
                      src={produk!.gambarUtama}
                      fill
                      alt={`Produk ${produk!.namaBrand}`}
                      className="object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="order-2 lg:order-1 space-y-6">
                <Image
                  src={produk!.logoSrc}
                  width={200}
                  height={150}
                  alt={`Logo ${produk!.namaBrand}`}
                  className="block"
                />
                <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed text-justify [text-align-last:start]">
                  {t(produk!.descKey)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-15">
          <div className="mx-auto max-w-7xl">
            <TabsCustom
              tabs={[
                { id: "fitur", label: t("specification"), icon: "Settings" },
                { id: "tipe", label: t("type"), icon: "Layers" },
                { id: "kontak", label: "Kontak", icon: "Phone" },
              ]}
              data={{
                features: produk!.featuresKeys.map((key) => t(key)),
                variants: produk!.variants,
                contact: {
                  title: "Hubungi kami",
                  description:
                    "Konsultasikan dengan tim profesional kami untuk kebutuhan proyek kontruksi anda.",
                },
              }}
              defaultTab="fitur"
              accent="red"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
