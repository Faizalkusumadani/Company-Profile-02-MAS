import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingCart, Building2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Formcontact from "@/components/ui/Formcontact";
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
    title: "Kontak",
    description:
      "Informasi kontak dan lokasi kantor kami di Jakarta dan Serang.",

    openGraph: {
      title: " Mega Adhitama Sejati | Kontak",
      description:
        "Informasi kontak dan lokasi kantor kami di Jakarta dan Serang.",
      url: `${siteUrl}/${locale}/kontak`,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/kontak`,
      languages: {
        "id-ID": `${siteUrl}/id/kontak`,
        "en-US": `${siteUrl}/en/kontak`,
      },
    },
  };
}

export default function Kontak() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Navigation");

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("contact"), current: true },
  ];

  return (
    <section id="kontak">
      <div className="w-full py-20">
        <header className="p-6 sm:p-8 bg-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 mb-3 sm:mb-4">
              {tNav("contact")}
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
        <div className="py-8 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6 mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image */}
                <div className="order-1 lg:order-1">
                  <div className="lg:col-span-1">
                    <div className="relative aspect-auto rounded-2xl overflow-hidden ">
                      <Image
                        src="/images/tallent-20.png"
                        alt="Customer Service"
                        width={900}
                        height={600}
                        priority
                        loading="eager"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                {/* Location */}
                <div className="space-y-6">
                  <div className="lg:col-span-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-700">
                      {t("title")}
                    </h2>
                  </div>

                  {/* Location Cards */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-red-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 mb-1">
                          {t("desc_1")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Grand Puri Niaga Blok K6 No. 5S JI. Puri Kencana,
                          Kembangan Jakarta 1161
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-red-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 mb-1">
                          {t("desc_2")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Jl. Jenderal Ahmad Yani Serang No.30, Cipare, Kec.
                          Serang, Kota Serang, Banten 42117
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-red-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 mb-1">
                          {t("desc_3")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Jl. Sultan Agung Tirtayasa No.18A, Kotabaru, Kec.
                          Serang, Kota Serang, Banten 42112
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4 space-y-6">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-700">
                {t("titleform")}{" "}
                <span className="text-red-700">{t("titleform_1")}</span>
              </h3>
              <p className="text-gray-500 py-4">{t("descform")}</p>
            </div>
            {/* Form */}
            <Formcontact />
          </div>
        </div>
      </div>
    </section>
  );
}
