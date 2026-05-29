"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare } from "lucide-react"
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

export default function AdminReservationsPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const load = async () => {
    if (!session) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: "50" })
      if (filter) params.set("status", filter)
      const res = await fetch(`${BACKEND}/api/reservations?${params}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      const d = await res.json()
      setReservations(d.reservations || [])
      setTotal(d.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [session, filter])

  const handleAction = async (id: string, status: string, adminNotes?: string) => {
    if (!session) return
    try {
      await fetch(`${BACKEND}/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ status, adminNotes }),
      })
      toast.success(status === "approved" ? "Demande confirmée" : "Demande refusée")
      load()
    } catch {
      toast.error("Erreur")
    }
  }

  const tabs = [
    { label: "Toutes", value: "" },
    { label: t.reservation.status.pending, value: "pending" },
    { label: t.reservation.status.approved, value: "approved" },
    { label: t.reservation.status.rejected, value: "rejected" },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">{t.admin.reservations}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn("pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px",
              filter === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Aucune demande</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Demandeur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Bien</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Acompte</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.user.image ? (
                          <Image src={r.user.image} alt="" width={28} height={28} className="rounded-full" />
                        ) : (
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">{r.user.name?.[0]}</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{r.user.name}</p>
                          <p className="text-xs text-gray-400">{r.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/properties/${r.property._id}`} className="font-medium text-gray-800 hover:text-blue-600 text-xs truncate max-w-[150px] block">
                        {r.property.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {r.requestType === "visit" ? "Visite" : "Réservation"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600 text-xs">
                      {r.depositAmount ? formatPrice(r.depositAmount) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusStyles[r.status])}>
                        {t.reservation.status[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {r.status === "pending" && (
                          <>
                            <button onClick={() => handleAction(r._id, "approved")} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors">
                              {t.admin.approve}
                            </button>
                            <button onClick={() => handleAction(r._id, "rejected")} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">
                              {t.admin.reject}
                            </button>
                          </>
                        )}
                        {r.user.phone && (
                          <a
                            href={buildWhatsAppLink(r.user.phone, `Bonjour ${r.user.name}, votre demande pour ${r.property.title} a été confirmée.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}
                        <Link href={`/admin/reservations/${r._id}`} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                          Détail
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {total} demande{total !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  )
}
