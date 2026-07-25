import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React from "react";
import { Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  activitiesData,
  getAllActivityParams,
  getActivityGalleryImages,
  generateHref,
} from "../../../../tools/all_activities";
import ActivityGallery from "@/components/ui/SlidesGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Metadata } from "next";

// ── Site URL ────────────────────────────────────────────────────
const siteUrl = "https://megaadhitamasejati.id";

// ── Static Params ──────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllActivityParams();
}

// ── Metadata Dinamis ───────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const t = await getTranslations({ locale, namespace: "Roominformation" });

  const activity = activitiesData.find((a) => a.slug === slug);
  if (!activity) return {};

  const title = t(`${activity.contentKey}_title`);
  const description = t(`${activity.contentKey}_description`);
  const imagePath = activity.imageDetail ?? activity.image;
  const imageUrl = `${siteUrl}${encodeURI(imagePath)}`;
  const url = `${siteUrl}/${locale}/informasi/kegiatan/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `Mega Adhitama Sejati | ${title}`,
      description,
      url,
      siteName: "Mega Adhitama Sejati",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        "id-ID": `${siteUrl}/id/informasi/kegiatan/${slug}`,
        "en-US": `${siteUrl}/en/informasi/kegiatan/${slug}`,
      },
    },
  };
}

// ── Page Component ─────────────────────────────────────────────
export default async function KegiatanDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Cari data kegiatan berdasarkan slug → 404 jika tidak ada
  const activity = activitiesData.find((a) => a.slug === slug);
  if (!activity) notFound();

  const tNav = await getTranslations({ locale, namespace: "Navigation" });
  const t = await getTranslations({ locale, namespace: "Roominformation" });
  const title = t(`${activity.contentKey}_title`);
  const date = t(`${activity.contentKey}_date`);

  const allActivities = activitiesData.map((a) => ({
    ...a,
    href: generateHref(a.slug),
    title: t(`${a.contentKey}_title`),
    description: t(`${a.contentKey}_description`),
    date: t(`${a.contentKey}_date`),
  }));

  const breadcrumbs = [
    { label: tNav("home"), href: "/" },
    { label: tNav("info.title"), href: "#" },
    { label: tNav("info.activities"), href: "/informasi/kegiatan" },
    { label: title, current: true },
  ];

  const currentHref = generateHref(slug);

  return (
    <section id={slug}>
      <div className="w-full py-20">
        {/* ── Header ── */}
        <header className="p-6 sm:p-8 ">
          <div className="mx-auto max-w-6xl">
            {/* Aksen garis merah di atas judul */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="block w-8 h-1 rounded-full bg-mas-red" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>

            <Breadcrumb>
              <BreadcrumbList className="text-xs sm:text-sm md:text-base">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.current ? (
                        <BreadcrumbPage className="text-mas-red">
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

        {/* ── Content ── */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* ── Artikel Utama ── */}
              <article className="order-1 lg:col-span-2">
                <div className="py-6 space-y-5">
                  <h2 className="text-gray-700 text-xl sm:text-3xl font-semibold">
                    {title}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {t("posted")} Admin &mdash; <time>{date}</time>
                  </p>
                </div>

                <ActivityGallery
                  images={getActivityGalleryImages(activity)}
                  alt={title}
                />

                <div className="py-5 space-y-6 leading-relaxed text-justify">
                  {(() => {
                    // t.raw() mengembalikan nilai asli (array atau string) dari i18n
                    const raw = t.raw(`${activity.contentKey}_content_1`);
                    const paragraphs: string[] = Array.isArray(raw)
                      ? raw
                      : [String(raw)];

                    return paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-500 text-sm sm:text-base"
                      >
                        {index === 0 && (
                          <>
                            <span className="font-bold text-gray-700">
                              Serang <time dateTime={date}>{date}</time>
                            </span>{" "}
                            &mdash;{" "}
                          </>
                        )}
                        {paragraph}
                      </p>
                    ));
                  })()}
                </div>
              </article>

              {/* ── Sidebar: Kegiatan Lainnya ── */}
              <aside className="order-2 lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-red-600 to-mas-red px-6 py-2">
                    <h2 className="text-white text-lg font-bold tracking-wide">
                      {t("activities")} {t("others")}
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-200 max-h-max overflow-y-auto">
                    {allActivities.map((item) => {
                      const isActive = item.href === currentHref;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`block p-4 transition-colors duration-200 group ${
                            isActive ? "bg-gray-100" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={item.image.trim()}
                                alt={item.title}
                                fill
                                sizes="128px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <h3
                                className={`font-semibold text-sm leading-snug mb-2 line-clamp-3 transition-colors ${
                                  isActive
                                    ? "text-mas-red"
                                    : "text-gray-900 group-hover:text-mas-red"
                                }`}
                              >
                                {item.description}
                              </h3>
                              <div className="flex items-center text-gray-500 text-xs mt-auto">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <time className="font-medium">{item.date}</time>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
