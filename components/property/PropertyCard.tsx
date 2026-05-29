"use client"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Maximize2, Heart } from "lucide-react"
import { Property } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
  property: Property
  compact?: boolean
}

const TYPE_BADGE = {
  sale_immediate: { label: "À vendre", cls: "bg-green-500" },
  sale_surplan: { label: "Sur plan", cls: "bg-orange-400" },
  rent: { label: "À louer", cls: "bg-blue-500" },
}

export default function PropertyCard({ property, compact }: Props) {
  const { lang } = useLanguage()
  const [saved, setSaved] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  const images = property.images || []
  const imgSrc = images[imgIdx]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70"

  const isSurPlan = property.saleType === "sur-plan"
  const badgeKey = isSurPlan ? "sale_surplan" : property.type === "rent" ? "rent" : "sale_immediate"
  const badge = TYPE_BADGE[badgeKey]

  const title = (lang === "fr" ? property.titleFr : property.titleEn) || property.title
  const city = property.location?.city
  const gov = property.location?.governorate
  const location = [city, gov].filter(Boolean).join(", ")

  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group", compact && "text-sm")}>
      {/* Image wrapper */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />

        {/* Badge top-left */}
        <span className={cn("absolute top-3 left-3 text-white text-[11px] font-bold px-2.5 py-1 rounded-full", badge.cls)}>
          {badge.label}
        </span>

        {/* Heart top-right */}
        <button
          onClick={e => { e.preventDefault(); setSaved(s => !s) }}
          className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={cn("w-3.5 h-3.5", saved ? "fill-red-500 text-red-500" : "text-gray-400")} />
        </button>

        {/* Dot counter bottom-left */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-3 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setImgIdx(i) }}
                className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === imgIdx ? "bg-white" : "bg-white/50")}
              />
            ))}
          </div>
        )}

        {/* Image count bottom-right */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 right-3 flex items-center gap-0.5 text-white text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full">
            <span>{imgIdx + 1}</span>
            <span>/</span>
            <span>{images.length}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/properties/${property._id}`} className="block p-4">
        {/* Price */}
        <p className={cn("font-extrabold text-blue-600", compact ? "text-base" : "text-lg")}>
          {isSurPlan && <span className="text-sm font-semibold text-gray-500 mr-1">À partir de</span>}
          {formatPrice(property.price)}
          {property.type === "rent" && <span className="text-sm font-normal text-gray-400"> / mois</span>}
        </p>

        {/* Title */}
        <h3 className={cn("font-semibold text-gray-900 mt-1 leading-snug line-clamp-1", compact ? "text-sm" : "text-[15px]")}>
          {title}
        </h3>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-xs text-gray-400">{location}</span>
          </div>
        )}

        {/* Stats separator */}
        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center gap-4 text-gray-500">
          {property.rooms != null && (
            <div className="flex items-center gap-1 text-xs">
              <Bed className="w-3.5 h-3.5" />
              <span>{property.rooms}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1 text-xs">
              <Bath className="w-3.5 h-3.5" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.surface != null && (
            <div className="flex items-center gap-1 text-xs">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{property.surface} m²</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
