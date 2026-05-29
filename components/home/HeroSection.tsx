"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Home, DollarSign, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TUNISIAN_GOVERNORATES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRICE_OPTIONS = [
  { label: "Aucun", value: "" },
  { label: "100 000 TND", value: "100000" },
  { label: "200 000 TND", value: "200000" },
  { label: "500 000 TND", value: "500000" },
  { label: "1 000 000 TND", value: "1000000" },
  { label: "2 000 000 TND", value: "2000000" },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<"sale" | "rent" | "sur-plan">("sale");
  const [governorate, setGovernorate] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (tab === "sur-plan") params.set("saleType", "sur-plan");
    else params.set("type", tab);
    if (governorate) params.set("governorate", governorate);
    if (propertyType) params.set("propertyType", propertyType);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-sky-50 via-white to-blue-50 overflow-hidden min-h-[560px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT — text + search */}
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {t.hero.title}
              <br />
              <span className="text-blue-600">{t.hero.subtitle}</span>
            </h1>
            <p className="mt-4 text-base text-gray-500 max-w-sm leading-relaxed">
              {t.hero.description}
            </p>

            {/* Tab buttons */}
            <div className="flex gap-2 mt-7 mb-4">
              {(["sale", "rent", "sur-plan"] as const).map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={cn(
                    "px-5 py-2 rounded-lg text-sm font-semibold transition-colors border",
                    tab === tb
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600",
                  )}
                >
                  {tb === "sale"
                    ? t.hero.buy
                    : tb === "rent"
                      ? t.hero.rent
                      : t.hero.surplan}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                {/* Location */}
                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-0.5">
                      {t.search.location}
                    </span>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="text-sm font-medium text-gray-800 outline-none bg-transparent w-full"
                    >
                      <option value="">{t.search.allTunisia}</option>
                      {TUNISIAN_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property type */}
                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <Home className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-0.5">
                      {t.search.type}
                    </span>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="text-sm font-medium text-gray-800 outline-none bg-transparent w-full"
                    >
                      <option value="">{t.search.allTypes}</option>
                      {[
                        "apartment",
                        "villa",
                        "house",
                        "commercial",
                        "terrain",
                        "office",
                      ].map((pt) => (
                        <option key={pt} value={pt}>
                          {t.property[pt as keyof typeof t.property]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Max price */}
                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <DollarSign className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-0.5">
                      {t.search.maxPrice}
                    </span>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="text-sm font-medium text-gray-800 outline-none bg-transparent w-full"
                    >
                      {PRICE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shrink-0 sm:rounded-none rounded-b-xl sm:rounded-r-xl"
                >
                  <Search className="w-4 h-4" />
                  {t.hero.search}
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-5">
              {[
                t.hero.search === "Search"
                  ? "Quick response"
                  : "Réponse rapide",
                t.hero.search === "Search"
                  ? "Verified listings"
                  : "Annonces vérifiées",
                t.hero.search === "Search"
                  ? "Personalized support"
                  : "Accompagnement personnalisé",
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 text-sm text-gray-600"
                >
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-blue-600" />
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — hero image */}
          <div className="hidden lg:block relative">
            {/* Location badge */}
            <div className="absolute top-8 left-8 z-10 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Tunis, Les Berges du Lac
                </p>
                <p className="text-xs text-gray-400">Tunisie</p>
              </div>
            </div>

            <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85"
                alt="Luxe property Tunisia"
                fill
                className="object-cover"
                priority
                sizes="600px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* decorative blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-40 pointer-events-none" />
    </section>
  );
}
