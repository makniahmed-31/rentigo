"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, CreditCard, MessageSquare, ArrowLeft } from "lucide-react"
import { Reservation } from "@/types"
import { formatDate, formatPrice, buildWhatsAppLink, cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"
const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+21670123456"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
}

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch(`${BACKEND}/api/reservations/${id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(r => r.json())
      .then(setReservation)
      .catch(() => setReservation(null))
      .finally(() => setLoading(false))
  }, [session, id])

  const handleCancel = async () => {
    if (!session || !reservation) return
    if (!confirm("Confirmer l'annulation ?")) return
    try {
      const res = await fetch(`${BACKEND}/api/reservations/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      if (!res.ok) throw new Error()
      setReservation(r => r ? { ...r, status: "cancelled" } : null)
      toast.success("Demande annulée")
    } catch {
      toast.error("Erreur lors de l'annulation")
    }
  }

  if (loading || !reservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  const p = reservation.property
  const waMsg = `Bonjour, je souhaite des informations sur ma demande de réservation pour ${p.title}. Référence: ${reservation._id}`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/reservations" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Mes demandes
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold text-gray-900">Demande de {reservation.requestType === "visit" ? "visite" : "réservation"}</h1>
            <span className={cn("text-sm font-medium px-3 py-1.5 rounded-full", statusStyles[reservation.status])}>
              {t.reservation.status[reservation.status]}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Créée le {formatDate(reservation.createdAt)}</p>
        </div>

        {/* Property */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t.reservation.property}</h2>
          <div className="flex gap-4">
            {p.images?.[0]?.url && (
              <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div>
              <Link href={`/properties/${p._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                {p.title}
              </Link>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {p.location?.city}, {p.location?.governorate}
              </div>
              <p className="text-primary-600 font-bold text-sm mt-1">{formatPrice(p.price)}{p.type === "rent" && "/mois"}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Détails</h2>
          <div className="space-y-3">
            {reservation.visitDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-700">{formatDate(reservation.visitDate)} {reservation.visitTime && `à ${reservation.visitTime}`}</span>
              </div>
            )}
            {reservation.paymentMethod && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-700">
                  {reservation.paymentMethod === "virement" ? t.reservation.virement
                    : reservation.paymentMethod === "cash" ? t.reservation.cash
                    : t.reservation.mandatMinute}
                </span>
              </div>
            )}
            {reservation.depositAmount && (
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-xl">
                <span className="text-sm text-gray-700">{t.reservation.deposit}</span>
                <span className="font-bold text-primary-600">{formatPrice(reservation.depositAmount)}</span>
              </div>
            )}
          </div>
          {reservation.adminNotes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 mb-1">Note de l'administrateur</p>
              <p className="text-sm text-amber-800">{reservation.adminNotes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(ADMIN_PHONE, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Contacter sur WhatsApp
          </a>
          {["pending"].includes(reservation.status) && (
            <button
              onClick={handleCancel}
              className="flex-1 py-3 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              Annuler la demande
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
