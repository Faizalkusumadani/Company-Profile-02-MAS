"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import getProducts from "../../app/tools/produk";
import type { Product } from "../../app/tools/produk";

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const t = useTranslations("Products");

  const results = useMemo((): Product[] => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];

    const productData = getProducts(t);

    const keywords = trimmedQuery.split(/\s+/);
    return productData
      .filter((p) => keywords.every((kw) => p.name.toLowerCase().includes(kw)))
      .slice(0, 10);
  }, [query, t]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          <Search
            size={17}
            className="text-gray-500 group-hover:text-red-600 transition-colors shrink-0"
          />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-2xl">{t("search")}</DialogTitle>
          <div className="relative p-4">
            <Input
              placeholder={t("placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-9"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-2 pt-0">
          {/* State: belum ada query */}
          {!query && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>{t("search_desc")}</p>
            </div>
          )}

          {/* State: query ada tapi tidak ada hasil */}
          {query && results.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <p>
                {t("product")}{" "}
                <b className="text-foreground">&quot;{query}&quot;</b>
                {t("not_found")}
              </p>
            </div>
          )}

          {/* State: ada hasil */}
          <div className="grid gap-1">
            {results.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0 space-y-2">
                  <span className="font-semibold text-base truncate uppercase">
                    {product.name}
                  </span>
                  <span className="text-sm italic text-red-700">
                    {product.category}
                  </span>
                  <span className="text-sm line-clamp-3 text-gray-500">
                    {product.description}
                  </span>
                </div>

                {/* Hanya tampil jika discount terisi dan bukan string kosong */}
                {product.discount && (
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white shrink-0">
                    -{product.discount}%
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
