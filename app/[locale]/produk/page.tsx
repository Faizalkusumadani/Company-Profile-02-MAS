import { Link } from "@/i18n/navigation";
import React from "react";
import Categories from "../../tools/categories";
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
    title: "Produk",
    description: "Jelajahi Produk katalog Mega Adhitama Sejati",

    openGraph: {
      title: " Mega Adhitama Sejati | Produk",
      description: "Jelajahi Produk katalog Mega Adhitama Sejati",
      url: `${siteUrl}/${locale}/produk`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/produk`,
      languages: {
        "id-ID": `${siteUrl}/id/produk`,
        "en-US": `${siteUrl}/en/produk`,
      },
    },
  };
}

export default function Produk() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Products");
  const allProducts = ProductData(t);

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("product"), current: true },
  ];

  const categoriesWithProducts = Categories.map((cat) => {
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
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("product")}
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
        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6 text-center">
              <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-5xl font-semibold">
                {t("titleproducts")}
                <span className="text-red-700"> {t("titleproducts_1")}</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg md:text-lg max-w-2xl mx-auto text-center mt-6">
                {t("desc_products")}
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
