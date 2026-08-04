import { Link } from "@/i18n/navigation";
import React from "react";
import getCategories from "../../tools/categories";
import ProductData from "../../tools/produk";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MenuTabs from "@/components/ui/Menutabs";
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
    title: t("metadata.products_pages"),
    description: t("metadata.products_pages_desc"),
  });
}

export default async function Produk({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const allProducts = ProductData(t);

  const breadcrumbs = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Navigation.product"), current: true },
  ];

  const categoriesWithProducts = getCategories(t).map((cat) => {
    if (cat.id === "all") {
      return { ...cat, products: allProducts };
    }

    return {
      ...cat,
      products: allProducts.filter((p) => p.category === cat.id),
    };
  });
  return (
    <section id="Produk">
      <div className="w-full py-20">
        <header className="p-6 sm:p-8 ">
          <div className="mx-auto max-w-6xl">
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
        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6 text-center">
              <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-[63px] font-semibold">
                {t("Products.title")}
                <span className="text-mas-red"> {t("Products.title_1")}</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg md:text-lg max-w-2xl mx-auto text-center mt-6">
                {t("Products.desc")}
              </p>
            </div>
            <div className="py-10 lg:py-15">
              <MenuTabs categories={categoriesWithProducts} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
