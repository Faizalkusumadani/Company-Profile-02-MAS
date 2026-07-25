"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Languageswitcher from "@/components/ui/Switcher";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Menu,
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

type NavItem = {
  href: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
};

// ─── Lazy load SearchDialog ───────────────────────────────────────────────────

const SearchDialog = dynamic(
  () => import("@/components/ui/Search").then((mod) => mod.SearchDialog),
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

function DesktopDropdownItem({
  href,
  label,
  desc,
  icon,
  active,
  onClick,
}: NavItem & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-start gap-3 rounded-lg p-3 transition-colors group",
        active
          ? "bg-gray-100 text-mas-red"
          : "text-gray-700 hover:bg-gray-100 hover:text-mas-red",
      )}
    >
      <div
        className={clsx(
          "mt-0.5 shrink-0 p-1.5 rounded-md transition-colors",
          active
            ? "bg-red-100 text-mas-red"
            : "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-mas-red",
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

// ─── Mobile Nav Item (flat link) ─────────────────────────────────────────────
function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors min-h-12",
        active
          ? "bg-red-50 text-mas-red"
          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
      )}
    >
      {label}
    </Link>
  );
}

// ─── Mobile Collapsible Sub-item ─────────────────────────────────────────────
function MobileSubItem({
  href,
  label,
  desc,
  icon,
  active,
  onClick,
}: NavItem & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors min-h-12",
        active
          ? "bg-red-50 text-mas-red font-medium"
          : "text-gray-600 hover:bg-gray-50 active:bg-gray-100",
      )}
    >
      <span
        className={clsx(
          "shrink-0 p-1.5 rounded-lg",
          active ? "bg-red-100 text-mas-red" : "bg-gray-100 text-gray-400",
        )}
      >
        {icon}
      </span>
      <div>
        <p className="font-medium leading-tight">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

// ─── Mobile Collapsible Section ───────────────────────────────────────────────
function MobileCollapsible({
  label,
  items,
  isOpen,
  onOpenChange,
  isSectionActive,
  isItemActive,
  onLinkClick,
}: {
  label: string;
  items: NavItem[];
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  isSectionActive: boolean;
  isItemActive: (href: string) => boolean;
  onLinkClick: () => void;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger
        className={clsx(
          "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors min-h-12",
          isSectionActive
            ? "bg-red-50 text-mas-red"
            : "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        )}
      >
        {label}
        <ChevronDown
          className={clsx(
            "w-4 h-4 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-3 pl-3 border-l-2 border-gray-100 space-y-0.5">
        {items.map((item) => (
          <MobileSubItem
            key={item.href}
            {...item}
            active={isItemActive(item.href)}
            onClick={onLinkClick}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
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

  // ── Active state helpers ──
  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    if (mobileOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [mobileOpen]);

  // ── Hide navbar on scroll down, show on scroll up ──
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
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
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleLinkClick = () => {
    setMobileOpen(false);
    setAboutOpen(false);
    setInfoOpen(false);
  };

  // ── Desktop nav link style ──
  const desktopNavLink = (path: string) =>
    clsx(
      "relative text-base font-normal transition-colors px-3 py-2 inline-flex items-center",
      "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all",
      isActive(path)
        ? "text-mas-red after:bg-mas-red"
        : "text-gray-600 hover:text-red-700 after:bg-transparent hover:after:bg-red-200",
    );

  // ── Desktop nav trigger style (dropdown) ──
  const desktopNavTrigger = (path: string) =>
    clsx(
      "relative text-base font-normal px-3 py-2 h-auto",
      "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
      "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all",
      isActive(path)
        ? "text-mas-red after:bg-mas-red"
        : "text-gray-600 hover:text-red-700 after:bg-transparent hover:after:bg-red-200 data-[state=open]:after:bg-red-200",
    );

  // ── Dropdown data ──
  const aboutItems: NavItem[] = [
    {
      href: "/profil/perusahaan",
      label: t("about.profile"),
      desc: t("about.profile_desc"),
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      href: "/profil/visi-misi",
      label: t("about.vision"),
      desc: t("about.vision_desc"),
      icon: <Target className="w-4 h-4" />,
    },
    {
      href: "/profil/pencapaian",
      label: t("about.achievement"),
      desc: t("about.achievement_desc"),
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      href: "/profil/manajemen",
      label: t("about.management"),
      desc: t("about.management_desc"),
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const infoItems: NavItem[] = [
    {
      href: "/informasi/berita",
      label: t("info.news"),
      desc: t("info.news_desc"),
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      href: "/informasi/kegiatan",
      label: t("info.activities"),
      desc: t("info.activities_desc"),
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={clsx(
        "fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50",
        "transition-transform duration-300 ease-in-out will-change-transform",
        navVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-20">
          {/* ── Logo ── */}
          <Link href="/" onClick={handleLinkClick} className="shrink-0">
            <Image
              src="/Logo-mas.webp"
              width={120}
              height={50}
              sizes="(max-width: 360px) 84px, (max-width: 640px) 100px, 120px"
              quality={80}
              className="h-15 w-21 sm:w-25 lg:w-30 "
              alt="Mega Adhitama Sejati"
              priority
            />
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-0">
                {/* Beranda */}
                <NavigationMenuItem>
                  <Link
                    href="/"
                    onClick={handleLinkClick}
                    className={desktopNavLink("/")}
                  >
                    {t("home")}
                  </Link>
                </NavigationMenuItem>

                {/* Tentang Kami */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={desktopNavTrigger("/profil")}
                  >
                    {t("about.title")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute top-full left-0 mt-1">
                    <div className="w-160 p-6">
                      <div className="grid grid-cols-2 gap-1">
                        {aboutItems.map((item) => (
                          <DesktopDropdownItem
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
                    className={desktopNavLink("/produk")}
                  >
                    {t("product")}
                  </Link>
                </NavigationMenuItem>

                {/* Ruang Informasi */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={desktopNavTrigger("/informasi")}
                  >
                    {t("info.title")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute top-full left-0 mt-1">
                    <div className="w-100 p-5">
                      <div className="grid gap-1">
                        {infoItems.map((item) => (
                          <DesktopDropdownItem
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
                    className={desktopNavLink("/karir")}
                  >
                    {t("career")}
                  </Link>
                </NavigationMenuItem>

                {/* Kontak */}
                <NavigationMenuItem>
                  <Link
                    href="/kontak"
                    onClick={handleLinkClick}
                    className={desktopNavLink("/kontak")}
                  >
                    {t("contact")}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Language & Search */}
            <div className="flex items-center ml-3 pl-3 border-l border-gray-200 gap-2">
              <Languageswitcher />
              <SearchDialog />
            </div>
          </nav>

          {/* ── Mobile: Language + Search + Hamburger ── */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5">
            <div className="pr-1.5 sm:pr-2 mr-0 sm:mr-0.5 border-r border-gray-200">
              <Languageswitcher />
            </div>
            <SearchDialog />

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-11 min-w-11 flex items-center justify-center"
                  aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full sm:w-[320px] p-0 flex flex-col"
              >
                {/* Sheet Header */}
                <SheetHeader className="px-5 py-4 border-b border-gray-100">
                  <SheetTitle asChild>
                    <Link href="/" onClick={handleLinkClick}>
                      <Image
                        src="/Logo-mas.webp"
                        width={100}
                        height={42}
                        sizes="100px"
                        quality={75}
                        alt="Mega Adhitama Sejati"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Items */}
                <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-0.5">
                  <MobileNavLink
                    href="/"
                    label={t("home")}
                    active={isActive("/")}
                    onClick={handleLinkClick}
                  />

                  <MobileCollapsible
                    label={t("about.title")}
                    items={aboutItems}
                    isOpen={aboutOpen}
                    onOpenChange={setAboutOpen}
                    isSectionActive={isActive("/profil")}
                    isItemActive={isActive}
                    onLinkClick={handleLinkClick}
                  />

                  <MobileNavLink
                    href="/produk"
                    label={t("product")}
                    active={isActive("/produk")}
                    onClick={handleLinkClick}
                  />

                  <MobileCollapsible
                    label={t("info.title")}
                    items={infoItems}
                    isOpen={infoOpen}
                    onOpenChange={setInfoOpen}
                    isSectionActive={isActive("/informasi")}
                    isItemActive={isActive}
                    onLinkClick={handleLinkClick}
                  />

                  <MobileNavLink
                    href="/karir"
                    label={t("career")}
                    active={isActive("/karir")}
                    onClick={handleLinkClick}
                  />

                  <MobileNavLink
                    href="/kontak"
                    label={t("contact")}
                    active={isActive("/kontak")}
                    onClick={handleLinkClick}
                  />
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <p className="text-xs text-gray-400 text-center">
                    © 2024 PT Mega Adhitama Sejati
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
