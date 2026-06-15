"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "id" ? "en" : "id";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      aria-label={`Switch to ${locale === "id" ? "English" : "Indonesia"}`}
      className={`
        flex items-center gap-1.5 px-3 py-2
        rounded-full border border-gray-200
        bg-white hover:bg-red-50 hover:border-red-200
        transition-all duration-200 group
        ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Globe
        size={17}
        className="text-gray-500 group-hover:text-red-600 transition-colors shrink-0"
      />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-700 group-hover:text-red-600 transition-colors w-5 text-center">
        {locale}
      </span>
    </button>
  );
}
