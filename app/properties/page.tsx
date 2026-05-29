"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutGrid, Map, Search } from "lucide-react"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyFilters from "@/components/property/PropertyFilters"
import { Property } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"
import dynamic from "next/dynamic"
import Link from "next/link"

const PropertyMap = dynamic(() => import("@/components/property/PropertyMap"), { ssr: false })

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Plus récents" },
  { value: "price", label: "Prix croissant" },
  { value: "-price", label: "Prix décroissant" },
  { value: "-views", label: "Plus populaires" },
]

function PropertiesContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "map">("grid")
  const [sort, setSort] = useState("-createdAt")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    params.set("page", String(page))
    params.set("limit", "12")
    if (search) params.set("search", search)

    fetch(`${BACKEND}/api/properties?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setProperties(data.properties || [])
        setTotal(data.total || 0)
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [searchParams, sort, page, search])

  useEffect(() => { setPage(1) }, [searchParams])

  const pages = Math.ceil(total / 12)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchParams.get("type") === "sale"
              ? "Biens à vendre"
              : searchParams.get("type") === "rent"
              ? "Biens à louer"
              : "Tous les biens"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} annonce{total !== 1 ? "s" : ""} trouvée{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-white">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm outline-none w-36"
            />
          </div>
          <PropertyFilters />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-primary-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("map")}
              className={`p-2.5 transition-colors ${view === "map" ? "bg-primary-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="mb-6">
          <PropertyMap properties={properties} height="500px" />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/3] animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">{t.common.noResults}</p>
          <Link href="/properties" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
            Voir tous les biens
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {properties.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Précédent
          </button>
          {[...Array(Math.min(pages, 5))].map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 text-sm rounded-xl transition-colors ${page === p ? "bg-primary-600 text-white" : "border border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            )
          })}
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24 text-gray-400">Chargement...</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
