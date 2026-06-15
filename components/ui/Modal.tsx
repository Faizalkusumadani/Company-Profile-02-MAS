"use client";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ManagementModalProps {
  name: string;
  position: string;
  image: string;
  description: string[];
}

export default function ManagementModal({
  name,
  position,
  image,
  description,
}: ManagementModalProps) {
  const t = useTranslations("About.management");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-colors duration-200 text-sm font-medium px-5 py-2"
        >
          {t("CTA")}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[92dvh] overflow-hidden rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[92dvh]">
          {/* ── Kolom Kiri: Foto + Nama + Jabatan ── */}
          <div className="flex flex-col items-center bg-gray-100 md:w-[38%] lg:w-[36%] shrink-0 p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative rounded-2xl overflow-hidden w-40 h-52 md:w-full md:h-102 lg:h-112 mb-5">
              <Image
                src={image}
                fill
                alt={name}
                className="object-cover object-top"
                sizes="(max-width: 768px) 160px, 340px"
                priority
              />
            </div>

            <div className="text-center w-full">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                {name}
              </DialogTitle>

              {/* ✅ Fixes Radix aria warning — invisible on screen, read by screen readers */}
              <DialogDescription className="sr-only">
                {position}
              </DialogDescription>

              <p className="mt-1 text-red-700 font-semibold text-sm md:text-base">
                {position}
              </p>
            </div>
          </div>

          {/* ── Kolom Kanan: Deskripsi ── */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="flex items-center gap-1.5 mb-6">
              <span className="block w-8 h-1 rounded-full bg-red-700" />
              <span className="block w-4 h-1 rounded-full bg-red-300" />
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
              {description.map((desc, i) => (
                <p key={i} className="text-sm md:text-base">
                  {desc}
                </p>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
