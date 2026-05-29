"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MapPin, Bed, Bath, Maximize2, Shield, Calendar, Share2 } from "lucide-react"
import ImageCarousel from "@/components/property/ImageCarousel"
import ReservationForm from "@/components/reservation/ReservationForm"
import { Property } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import dynamic from "next/dynamic"
import Link from "next/link"

const PropertyMap = dynamic(() => import("@/components/property/PropertyMap"), { ssr: false })

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useLanguage()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BACKEND}/api/properties/${id}`)
      .then(r => r.json())
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-1/2" />
        </div>
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  )

  if (!property) return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <p className="text-lg">Bien non trouvé</p>
      <Link href="/properties" className="mt-4 text-sm text-primary-600 hover:underline">← Retour aux annonces</Link>
    </div>
  )

  const title = (lang === "fr" ? property.titleFr : property.titleEn) || property.title
  const description = (lang === "fr" ? property.descriptionFr : property.descriptionEn) || property.description
  const location = [property.location?.address, property.location?.city, property.location?.governorate].filter(Boolean).join(", ")
  const isSurPlan = property.saleType === "sur-plan"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        <span>›</span>
        <Link href="/properties" className="hover:text-primary-600">Annonces</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium truncate">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <ImageCarousel images={property.images || []} title={title} />

          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold text-white rounded-full ${
                    isSurPlan ? "bg-orange-500" : property.type === "sale" ? "bg-green-500" : "bg-primary-500"
                  }`}>
                    {isSurPlan ? t.property.surPlan : property.type === "sale" ? t.property.forSale : t.property.forRent}
                  </span>
                  {property.isVerified && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                      <Shield className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
              <button
                onClick={() => navigator.share?.({ title, url: window.location.href })}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <p className="text-3xl font-extrabold text-primary-600">
                {isSurPlan && <span className="text-base font-normal text-gray-500 mr-1">{t.property.from} </span>}
                {formatPrice(property.price)}
                {property.type === "rent" && <span className="text-base font-normal text-gray-500">{t.property.perMonth}</span>}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
              {property.rooms != null && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Bed className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold">{property.rooms}</span>
                  <span className="text-gray-500">{t.property.rooms}</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Bath className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-gray-500">{t.property.bathrooms}</span>
                </div>
              )}
              {property.surface != null && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Maximize2 className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold">{property.surface}</span>
                  <span className="text-gray-500">m²</span>
                </div>
              )}
              {property.floor != null && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>Étage {property.floor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.property.description}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.property.amenities}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-lg text-sm text-primary-700">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {property.location?.lat && property.location?.lng && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.property.location}</h2>
              <PropertyMap
                properties={[property]}
                center={[property.location.lat, property.location.lng]}
                zoom={15}
                height="300px"
              />
            </div>
          )}
        </div>

        {/* Right column - Reservation form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {property.type === "sale" ? t.reservation.visitTitle : t.reservation.title}
            </h2>
            <ReservationForm property={property} />
          </div>
        </div>
      </div>
    </div>
  )
}
