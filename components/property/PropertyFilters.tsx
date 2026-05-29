"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { TUNISIAN_GOVERNORATES } from "@/lib/utils"

interface Filters {
  type?: string
  propertyType?: string
  governorate?: string
  minPrice?: string
  maxPrice?: string
  rooms?: string
  minSurface?: string
  maxSurface?: string
}

export default function PropertyFilters() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    setFilters({
      type: searchParams.get("type") || "",
      propertyType: searchParams.get("propertyType") || "",
      governorate: searchParams.get("governorate") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rooms: searchParams.get("rooms") || "",
      minSurface: searchParams.get("minSurface") || "",
      maxSurface: searchParams.get("maxSurface") || "",
    })
  }, [searchParams])

  const apply = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`/properties?${params.toString()}`)
    setOpen(false)
  }

  const reset = () => {
    setFilters({})
    router.push("/properties")
    setOpen(false)
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-400 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t.search.filters}
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">{t.search.filters}</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Transaction type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Type</label>
              <select
                value={filters.type || ""}
                onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.search.allTypes}</option>
                <option value="sale">{t.property.forSale}</option>
                <option value="rent">{t.property.forRent}</option>
              </select>
            </div>

            {/* Property type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{t.search.type}</label>
              <select
                value={filters.propertyType || ""}
                onChange={(e) => setFilters(f => ({ ...f, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.search.allTypes}</option>
                {["apartment","villa","house","commercial","terrain","office"].map(pt => (
                  <option key={pt} value={pt}>{t.property[pt as keyof typeof t.property]}</option>
                ))}
              </select>
            </div>

            {/* Governorate */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{t.search.location}</label>
              <select
                value={filters.governorate || ""}
                onChange={(e) => setFilters(f => ({ ...f, governorate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.search.allTunisia}</option>
                {TUNISIAN_GOVERNORATES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Prix (TND)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t.search.min}
                  value={filters.minPrice || ""}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder={t.search.max}
                  value={filters.maxPrice || ""}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{t.search.rooms}</label>
              <div className="flex gap-2">
                {["1","2","3","4","5+"].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilters(f => ({ ...f, rooms: f.rooms === r ? "" : r }))}
                    className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                      filters.rooms === r ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={reset} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              {t.search.reset}
            </button>
            <button onClick={apply} className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
              {t.search.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
