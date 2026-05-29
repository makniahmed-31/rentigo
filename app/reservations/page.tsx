"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ReservationCard from "@/components/reservation/ReservationCard"
import { Reservation } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export default function ReservationsPage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    const url = filter
      ? `${BACKEND}/api/reservations?status=${filter}`
      : `${BACKEND}/api/reservations`

    fetch(url, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(r => r.json())
      .then(d => setReservations(d.reservations || []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }, [session, filter])

  const tabs = [
    { label: "Toutes", value: "" },
    { label: t.reservation.status.pending, value: "pending" },
    { label: t.reservation.status.approved, value: "approved" },
    { label: t.reservation.status.rejected, value: "rejected" },
  ]

  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.profile.myReservations}</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === tab.value
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Aucune demande trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => <ReservationCard key={r._id} reservation={r} />)}
        </div>
      )}
    </div>
  )
}
