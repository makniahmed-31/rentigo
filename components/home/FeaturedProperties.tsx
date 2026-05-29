"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "@/components/property/PropertyCard"
import { Property } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

interface Props {
  title: string
  apiUrl: string
}

export default function FeaturedProperties({ title, apiUrl }: Props) {
  const { t } = useLanguage()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    fetch(`${BACKEND}${apiUrl}`)
      .then(r => r.json())
      .then(data => setProperties(Array.isArray(data) ? data : data.properties || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [apiUrl])

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const width = scrollRef.current.clientWidth * 0.7
    scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" })
    setTimeout(updateArrows, 350)
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <Link href="/properties" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
            {t.property.seeAll} <span>→</span>
          </Link>
        </div>

        {/* Carousel wrapper with side arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Cards scroll */}
          {loading ? (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[260px] flex-1 aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">{t.common.noResults}</div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="flex gap-5 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {properties.map(p => (
                <div key={p._id} className="min-w-[260px] max-w-[260px] flex-shrink-0 sm:min-w-[280px] sm:max-w-[280px]">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-gray-50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}
