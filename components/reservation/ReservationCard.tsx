"use client"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, CreditCard, MessageSquare } from "lucide-react"
import { Reservation } from "@/types"
import { formatDate, formatPrice, buildWhatsAppLink, cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
}

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+21670123456"

export default function ReservationCard({ reservation }: { reservation: Reservation }) {
  const { t } = useLanguage()
  const p = reservation.property
  const statusLabel = t.reservation.status[reservation.status]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
      {p.images?.[0]?.url && (
        <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
          <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="96px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/properties/${p._id}`} className="font-semibold text-gray-900 text-sm hover:text-blue-600 truncate pr-2">
            {p.title}
          </Link>
          <span className={cn("shrink-0 text-xs font-medium px-2.5 py-1 rounded-full", statusStyles[reservation.status])}>
            {statusLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {p.location?.city}, {p.location?.governorate}
          </span>
          {reservation.visitDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(reservation.visitDate)}
            </span>
          )}
          {reservation.depositAmount && (
            <span className="flex items-center gap-1 font-medium text-blue-600">
              <CreditCard className="w-3 h-3" />
              Acompte: {formatPrice(reservation.depositAmount)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Link href={`/reservations/${reservation._id}`} className="text-xs font-medium text-blue-600 hover:underline">
            Voir le détail →
          </Link>
          {reservation.status === "approved" && (
            <a
              href={buildWhatsAppLink(ADMIN_PHONE, `Bonjour, je souhaite confirmer ma réservation pour ${p.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-green-600 hover:underline"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
