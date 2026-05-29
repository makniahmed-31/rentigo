"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  Home,
  Search,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "home" as const },
  { href: "/properties?type=sale", label: "buy" as const },
  { href: "/properties?type=rent", label: "rent" as const },
  { href: "/properties?saleType=sur-plan", label: "surplan" as const },
  { href: "/about", label: "about" as const },
  { href: "/contact", label: "contact" as const },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Rentigo</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-5 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {t.nav[label]}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
            {/* Language */}
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{lang.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t.nav.profile}
                    </Link>
                    <Link
                      href="/reservations"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t.nav.myReservations}
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 text-sm text-blue-600 font-medium hover:bg-blue-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t.nav.admin}
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  {t.nav.login}
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden ml-auto p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50",
              )}
            >
              {t.nav[label]}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-3 px-3 border-t border-gray-100 mt-2">
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              <Globe className="w-4 h-4" />
              {lang.toUpperCase()}
            </button>
            {!session ? (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                <Search className="w-4 h-4" />
                {t.nav.login}
              </Link>
            ) : (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
                className="flex-1 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg"
              >
                {t.nav.logout}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
