"use client"
import { useEffect, useRef } from "react"
import { Property } from "@/types"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface Props {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
}

export default function PropertyMap({ properties, center = [33.886917, 9.537499], zoom = 7, height = "500px" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return
    if (mapInstance.current) return

    const init = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Fix marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return
      const map = L.map(mapRef.current).setView(center, zoom)
      mapInstance.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      properties.forEach(p => {
        const lat = p.location?.lat
        const lng = p.location?.lng
        if (!lat || !lng) return

        const popup = `
          <div style="min-width:160px">
            ${p.images?.[0]?.url ? `<img src="${p.images[0].url}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ""}
            <p style="font-weight:700;color:#2563eb;margin:0 0 4px">${formatPrice(p.price)}${p.type === "rent" ? "/mois" : ""}</p>
            <p style="font-size:13px;margin:0 0 4px;font-weight:600">${p.title}</p>
            <a href="/properties/${p._id}" style="font-size:12px;color:#2563eb;text-decoration:underline">Voir le détail →</a>
          </div>
        `
        L.marker([lat, lng]).addTo(map).bindPopup(popup)
      })
    }

    init()

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    // Update markers when properties change would go here
  }, [properties])

  return <div ref={mapRef} style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }} />
}
