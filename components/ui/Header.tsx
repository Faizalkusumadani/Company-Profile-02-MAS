"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Languageswitcher from "@/components/ui/switcher";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Menu,
  X,
  Building2,
  Target,
  Trophy,
  Users,
  Newspaper,
  Calendar,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── Types ────────────────────────────────────────────────────────────────────
type DropdownItem = {
  href: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
};

// ─── Lazy load SearchDialog ───────────────────────────────────────────────────
const SearchDialog = dynamic(
  () => import("@/components/ui/search").then((mod) => mod.SearchDialog),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-9 border rounded-md bg-gray-50 flex items-center justify-center">
        <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    ),
  },
);

// ─── Desktop Dropdown Item ────────────────────────────────────────────────────
function DropdownLink({
  href,
  label,
  desc,
  icon,
  active,
  onClick,
}: DropdownItem & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-start gap-3 rounded-lg p-3 transition-colors group",
        active
          ? "bg-red-50 text-red-700"
          : "hover:bg-red-50 hover:text-red-700 text-gray-700",
      )}
    >
      <div
        className={clsx(
          "mt-0.5 shrink-0 p-1.5 rounded-md transition-colors",
          active
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-700",
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold leading-tight">{label}</p>
        <p className="text-sm text-gray-400 mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Navbar = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // ── Hide nav on scroll down ──
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastScrollY && currentY > 70) {
            setNavVisible(false);
            setMobileOpen(false);
          } else {
            setNavVisible(true);
          }
          setLastScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleLinkClick = () => {
    setMobileOpen(false);
    setAboutOpen(false);
    setInfoOpen(false);
  };

  // ── Nav item base styles ──
  const navLinkClass = (path: string) =>
    clsx("text-base font-normal transition-colors px-1 py-2", {
      "text-red-700": isActive(path),
      "text-gray-600 hover:text-red-700": !isActive(path),
    });

  // ── Dropdown data ──
  const aboutItems: DropdownItem[] = [
    {
      href: "/profil/perusahaan",
      label: t("about.profile"),
      desc: "Sejarah dan profil perusahaan kami",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      href: "/profil/visi-misi",
      label: t("about.vision"),
      desc: "Visi, misi, dan nilai-nilai perusahaan",
      icon: <Target className="w-6 h-6" />,
    },
    {
      href: "/profil/pencapaian",
      label: t("about.achievement"),
      desc: "Penghargaan dan pencapaian kami",
      icon: <Trophy className="w-6 h-6" />,
    },
    {
      href: "/profil/manajemen",
      label: t("about.management"),
      desc: "Tim manajemen dan kepemimpinan",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const infoItems: DropdownItem[] = [
    {
      href: "/informasi/berita",
      label: t("info.news"),
      desc: "Berita terkini seputar perusahaan",
      icon: <Newspaper className="w-6 h-6" />,
    },
    {
      href: "/informasi/kegiatan",
      label: t("info.activities"),
      desc: "Dokumentasi kegiatan dan event",
      icon: <Calendar className="w-6 h-6" />,
    },
  ];

  return (
    <>
      {/* ── Navbar Container ── */}
      <div
        className={clsx(
          "fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-red-100 z-50 transition-transform duration-300 ease-in-out will-change-transform",
          navVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ── Logo ── */}
            <Link href="/" onClick={handleLinkClick} className="shrink-0">
              <Image
                src="/Logo mas.png"
                width={200}
                height={200}
                style={{ width: "120px", height: "auto" }}
                alt="Mega Adhitama Sejati"
                priority
              />
            </Link>
            {/* ── Desktop Navigation  ── */}
            <div className="hidden md:flex items-center gap-1">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-0">
                  {/* Beranda */}
                  <NavigationMenuItem>
                    <Link
                      href="/"
                      onClick={handleLinkClick}
                      className={navLinkClass("/")}
                    >
                      <span className="px-3 py-2 inline-block">
                        {t("home")}
                      </span>
                    </Link>
                  </NavigationMenuItem>

                  {/* Tentang Kami */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={clsx(
                        "text-base font-normal bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                        isActive("/profil")
                          ? "text-red-700"
                          : "text-gray-600 hover:text-red-700",
                      )}
                    >
                      {t("about.title")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute top-full left-0 mt-1">
                      <div className="w-145 p-3">
                        {/* Header dropdown */}
                        <div className="px-3 py-2 mb-2 border-b border-gray-100">
                          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                            {t("about.title")}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {aboutItems.map((item) => (
                            <DropdownLink
                              key={item.href}
                              {...item}
                              active={isActive(item.href)}
                              onClick={handleLinkClick}
                            />
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Produk */}
                  <NavigationMenuItem>
                    <Link
                      href="/produk"
                      onClick={handleLinkClick}
                      className={navLinkClass("/produk")}
                    >
                      <span className="px-3 py-2 inline-block">
                        {t("product")}
                      </span>
                    </Link>
                  </NavigationMenuItem>

                  {/* Ruang Informasi */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={clsx(
                        "text-base font-normal bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                        isActive("/informasi")
                          ? "text-red-700"
                          : "text-gray-600 hover:text-red-700",
                      )}
                    >
                      {t("info.title")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute top-full left-0 mt-1">
                      <div className="w-120 p-3">
                        <div className="px-3 py-2 mb-2 border-b border-gray-100">
                          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                            {t("info.title")}
                          </p>
                        </div>
                        <div className="grid gap-1">
                          {infoItems.map((item) => (
                            <DropdownLink
                              key={item.href}
                              {...item}
                              active={isActive(item.href)}
                              onClick={handleLinkClick}
                            />
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Karir */}
                  <NavigationMenuItem>
                    <Link
                      href="/karir"
                      onClick={handleLinkClick}
                      className={navLinkClass("/karir")}
                    >
                      <span className="px-3 py-2 inline-block">
                        {t("career")}
                      </span>
                    </Link>
                  </NavigationMenuItem>

                  {/* Kontak */}
                  <NavigationMenuItem>
                    <Link
                      href="/kontak"
                      onClick={handleLinkClick}
                      className={navLinkClass("/kontak")}
                    >
                      <span className="px-3 py-2 inline-block">
                        {t("contact")}
                      </span>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Language & Search */}
              <div className="flex items-center ml-4 pl-4 border-l border-gray-200 gap-3">
                <Languageswitcher />
                <SearchDialog />
              </div>
            </div>
            {/* ── Mobile: Language + Search + Hamburger ── */}
            <div className="flex md:hidden items-center gap-1">
              <div className="pr-2 mr-1 border-r border-gray-200">
                <Languageswitcher />
              </div>

              {/* Search */}
              <SearchDialog />

              {/* Hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-full sm:w-80 p-0 flex flex-col"
                >
                  {/* Sheet Header */}
                  <SheetHeader className="p-5 border-b border-gray-100">
                    <SheetTitle asChild>
                      <Link href="/" onClick={handleLinkClick}>
                        <Image
                          src="/Logo mas.png"
                          width={100}
                          height={45}
                          alt="Mega Adhitama Sejati"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Nav Items */}
                  <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {/* Beranda */}
                    <Link
                      href="/"
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/")
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      {t("home")}
                    </Link>

                    {/* Tentang Kami - Collapsible */}
                    <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
                      <CollapsibleTrigger
                        className={clsx(
                          "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive("/profil")
                            ? "bg-red-50 text-red-700"
                            : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {t("about.title")}
                        <ChevronDown
                          className={clsx(
                            "w-4 h-4 transition-transform duration-200",
                            {
                              "rotate-180": aboutOpen,
                            },
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-3 pt-1 space-y-1">
                        {aboutItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={clsx(
                              "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
                              isActive(item.href)
                                ? "bg-red-50 text-red-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50",
                            )}
                          >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Produk */}
                    <Link
                      href="/produk"
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/produk")
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      {t("product")}
                    </Link>

                    {/* Ruang Informasi - Collapsible */}
                    <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
                      <CollapsibleTrigger
                        className={clsx(
                          "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive("/informasi")
                            ? "bg-red-50 text-red-700"
                            : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {t("info.title")}
                        <ChevronDown
                          className={clsx(
                            "w-4 h-4 transition-transform duration-200",
                            {
                              "rotate-180": infoOpen,
                            },
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-3 pt-1 space-y-1">
                        {infoItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={clsx(
                              "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
                              isActive(item.href)
                                ? "bg-red-50 text-red-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50",
                            )}
                          >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Karir */}
                    <Link
                      href="/karir"
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/karir")
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      {t("career")}
                    </Link>

                    {/* Kontak */}
                    <Link
                      href="/kontak"
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/kontak")
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      {t("contact")}
                    </Link>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t border-gray-100  text-center items-center ">
                    <p className="text-xs text-gray-400">
                      © 2024 Mega Adhitama Sejati
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
