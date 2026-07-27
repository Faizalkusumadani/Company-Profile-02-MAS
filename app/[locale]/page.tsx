import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/config/metadata";
import BerandaClient from "@/components/ui/Beranda-content";

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
    title: t("metadata.beranda_pages"),
    description: t("metadata.beranda_pages_desc"),
  });
}

export default function Page() {
  return <BerandaClient />;
}
