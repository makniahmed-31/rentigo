"use client"
import { useEffect, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { Property } from "@/types"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyFilters from "@/components/property/PropertyFilters"
import { useLanguage } from "@/contexts/LanguageContext"

const PropertyMap = dynamic(() => import("@/components/property/PropertyMap"), { ssr: false })

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

function MapContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Property | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", "50")
    fetch(`${BACKEND}/api/properties?${params.toString()}`)
      .then(r => r.json())
      .then(d => setProperties(d.properties || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [searchParams])

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <h1 className="font-bold text-gray-900 text-sm">{t.common.mapView}</h1>
        <span className="text-gray-400 text-sm">·</span>
        <span className="text-gray-500 text-sm">{properties.length} biens</span>
        <PropertyFilters />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar list */}
        <div className="w-96 shrink-0 overflow-y-auto border-r border-gray-100 bg-white p-4 space-y-3 hidden md:block">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)
            : properties.map(p => (
              <div key={p._id} onClick={() => setSelected(p)} className="cursor-pointer">
                <PropertyCard property={p} compact />
              </div>
            ))
          }
        </div>

        {/* Map */}
        <div className="flex-1">
          {!loading && <PropertyMap properties={properties} height="100%" />}
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Chargement de la carte...</div>}>
      <MapContent />
    </Suspense>
  )
}
