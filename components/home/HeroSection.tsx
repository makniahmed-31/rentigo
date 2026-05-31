"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Home, DollarSign, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TUNISIAN_GOVERNORATES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import houseModel from "@/assets/3d-rendering-house-model.png";

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
  const [locationInput, setLocationInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredGovernorates = TUNISIAN_GOVERNORATES.filter((g) =>
    g.toLowerCase().includes(locationInput.toLowerCase()),
  );

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
    <section className="relative bg-gradient-to-br from-white via-white to-primary-100 overflow-hidden min-h-[560px] flex items-center">
      {/* Right-side background image */}
      <div className="absolute inset-y-0 right-0  hidden lg:block">
        <Image
          src={houseModel}
          alt="Luxury property"
          height={560}
          priority
          className="object-cover"
        />

        {/* Fade into the content area */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" /> */}
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT — text + search */}
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {t.hero.title}
              <br />
              <span className="text-primary-600">{t.hero.subtitle}</span>
            </h1>
            <p className="mt-4 text-base text-gray-500 max-w-sm leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex mt-7 mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden w-fit">
              {(["sale", "rent", "sur-plan"] as const).map((tb, index) => {
                const isActive = tab === tb;

                const isFirst = index === 0;
                const isLast = index === 2;

                return (
                  <button
                    key={tb}
                    onClick={() => setTab(tb)}
                    className={cn(
                      "px-6 py-2 text-sm font-semibold transition-all",
                      "border-r border-gray-200 last:border-r-0",
                      isActive
                        ? "bg-primary-500 text-white"
                        : "bg-white text-gray-600 hover:text-primary-600",
                      isFirst && "rounded-l-lg",
                      isLast && "rounded-r-lg",
                    )}
                  >
                    {tb === "sale"
                      ? t.hero.buy
                      : tb === "rent"
                        ? t.hero.rent
                        : t.hero.surplan}
                  </button>
                );
              })}
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-visible">
              <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                {/* Location autocomplete */}
                <div className="flex items-center gap-2 px-4 py-3 flex-1 relative">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0" />

                  <div className="flex flex-col min-w-0 w-full">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-0.5">
                      {t.search.location}
                    </span>

                    <input
                      value={locationInput}
                      onChange={(e) => {
                        setLocationInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={t.search.allTunisia}
                      className="text-sm font-medium text-gray-800 outline-none bg-transparent w-full"
                    />

                    {/* Suggestions */}
                    {showSuggestions && locationInput && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-auto">
                        {filteredGovernorates.length > 0 ? (
                          filteredGovernorates.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setLocationInput(g);
                                setGovernorate(g);
                                setShowSuggestions(false);
                              }}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-100"
                            >
                              <MapPin className="w-3.5 h-3.5 text-secondary-500 shrink-0" />
                              <span>{g}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-400">
                            No results
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Property type */}
                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <Home className="w-4 h-4 text-primary-500 shrink-0" />
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
                  <DollarSign className="w-4 h-4 text-primary-500 shrink-0" />
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors shrink-0 sm:rounded-none rounded-b-xl sm:rounded-r-xl"
                >
                  <Search className="w-4 h-4" />
                  {t.hero.search}
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-5">
              {[
                t.features.verifiedDesc,
                t.features.bookingDesc,
                t.features.supportDesc,
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 text-sm text-gray-600"
                >
                  <div className="w-4 h-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-600" />
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
