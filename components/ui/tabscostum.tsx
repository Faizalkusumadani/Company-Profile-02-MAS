"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Settings, Layers, Phone, Check, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ProductVariant } from "../../app/tools/produkdetail";

// ─── Icon mapping ────────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Settings,
  Layers,
  Phone,
};

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface ContactInfo {
  title: string;
  description: string;
}

interface TabsCustomProps {
  tabs: Tab[];
  data: {
    features?: string[];
    variants?: ProductVariant[];
    contact?: ContactInfo;
  };
  defaultTab?: string;
  accent?: "red" | "blue" | "green" | "orange";
}

// ─── Accent color map ─────────────────────────────────────────────────────────
const accentColors = {
  red: {
    tab: "text-red-600 border-red-600 bg-gray-100 border-b-2 rounded-t-lg",
    tabHover: "hover:text-red-600",
    check: "text-red-600",
    checkBg: "bg-red-100",
    button: "bg-red-600 hover:bg-red-700",
  },
  blue: {
    tab: "text-blue-600 border-blue-600 bg-gray-100 border-b-2 rounded-t-lg",
    tabHover: "hover:text-blue-600",
    check: "text-blue-600",
    checkBg: "bg-blue-100",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  green: {
    tab: "text-green-600 border-green-600 bg-gray-100 border-b-2 rounded-t-lg",
    tabHover: "hover:text-green-600",
    check: "text-green-600",
    checkBg: "bg-green-100",
    button: "bg-green-600 hover:bg-green-700",
  },
  orange: {
    tab: "text-orange-600 border-orange-600 bg-gray-100 border-b-2 rounded-t-lg",
    tabHover: "hover:text-orange-600",
    check: "text-orange-600",
    checkBg: "bg-orange-100",
    button: "bg-orange-600 hover:bg-orange-700",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TabsCustom({
  tabs,
  data,
  defaultTab = tabs[0]?.id,
  accent = "red",
}: TabsCustomProps) {
  const t = useTranslations("Products");
  const [activeTab, setActiveTab] = useState(defaultTab);
  const colors = accentColors[accent];

  // ── Tab: Fitur / Specification ──────────────────────────────────────────────
  const renderFeatures = () => {
    if (!data.features?.length) return null;

    return (
      <div className="py-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-8">
          {t("specification_features")} :
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`shrink-0 mt-1 ${colors.check}`}>
                <div
                  className={`w-6 h-6 rounded-full ${colors.checkBg} flex items-center justify-center`}
                >
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-gray-600 font-semibold text-sm sm:text-base leading-relaxed">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Tab: Tipe / Variants ────────────────────────────────────────────────────
  const renderVariants = () => {
    if (!data.variants?.length) return null;

    return (
      <div className="py-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-8">
          {t("type")} {t("product")} :
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.variants.map((variant, index) => (
            <div
              key={variant.id ?? index}
              className="bg-white overflow-hidden group transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gambar variant — image bersifat optional di ProductVariant */}
              <div className="aspect-square relative bg-gray-100 rounded-2xl">
                {variant.image ? (
                  <Image
                    src={variant.image}
                    alt={variant.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain p-5"
                  />
                ) : (
                  // Fallback jika image tidak ada
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-normal text-base text-gray-700 mb-1 text-center">
                  {variant.name}
                </h4>
                {/* Field tambahan dari ProductVariant index signature */}
                {variant.size && (
                  <p className="text-xs text-gray-500 text-center">
                    {variant.size}
                  </p>
                )}
                {variant.color && (
                  <p className="text-xs text-gray-500 text-center">
                    {variant.color}
                  </p>
                )}
                {variant.weight && (
                  <p className="text-xs text-gray-500 text-center">
                    {variant.weight}
                  </p>
                )}
                {variant.description && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {variant.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Tab: Kontak ─────────────────────────────────────────────────────────────
  const renderContact = () => {
    if (!data.contact) return null;

    return (
      <div className="py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {data.contact.title}
          </h3>
          <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
            {data.contact.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className={`${colors.button} text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block`}
            >
              Hubungi Kami
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ── Render aktif tab berdasarkan id dari page.tsx ───────────────────────────
  // page.tsx mengirim: id "fitur", "tipe", "kontak"
  const renderContent = () => {
    switch (activeTab) {
      case "fitur":
        return renderFeatures();
      case "tipe":
        return renderVariants();
      case "kontak":
        return renderContact();
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* ── Tabs Navigation ── */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.icon];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-4 text-sm sm:text-base font-semibold
                  border-b-2 transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? colors.tab
                      : `text-gray-500 border-transparent ${colors.tabHover}`
                  }
                `}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
