"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import DashboardStats from "@/components/admin/DashboardStats"
import RevenueChart from "@/components/admin/RevenueChart"
import { AdminStats, Reservation } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import Image from "next/image"
import { formatDate, formatPrice, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    if (!session) return
    try {
      const res = await fetch(`${BACKEND}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      const data = await res.json()
      setStats(data)
    } catch {
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [session])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (!session) return
    try {
      await fetch(`${BACKEND}/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })
      toast.success(action === "approve" ? "Demande confirmée" : "Demande refusée")
      loadStats()
    } catch {
      toast.error("Erreur")
    }
  }

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  )

  if (!stats) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t.admin.dashboard}</h1>
      <DashboardStats stats={stats} />
      <RevenueChart stats={stats} />

      {/* Recent pending reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">{t.admin.recentReservations}</h2>
          <Link href="/admin/reservations" className="text-sm text-blue-600 hover:underline">
            Voir tout →
          </Link>
        </div>
        {stats.recentReservations.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">Aucune demande en attente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 font-semibold text-gray-500">Demandeur</th>
                  <th className="text-left pb-3 font-semibold text-gray-500">Bien</th>
                  <th className="text-left pb-3 font-semibold text-gray-500">Type</th>
                  <th className="text-left pb-3 font-semibold text-gray-500">Date</th>
                  <th className="text-left pb-3 font-semibold text-gray-500">Montant</th>
                  <th className="text-left pb-3 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentReservations.map((r: Reservation) => (
                  <tr key={r._id}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {r.user.image ? (
                          <Image src={r.user.image} alt="" width={28} height={28} className="rounded-full" />
                        ) : (
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                            {r.user.name?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{r.user.name}</p>
                          <p className="text-xs text-gray-400">{r.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {r.property.images?.[0]?.url && (
                          <Image src={r.property.images[0].url} alt="" width={36} height={28} className="rounded-lg object-cover" />
                        )}
                        <Link href={`/properties/${r.property._id}`} className="font-medium text-gray-800 hover:text-blue-600 truncate max-w-[140px]">
                          {r.property.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {r.requestType === "visit" ? "Visite" : "Réservation"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="py-3 font-semibold text-blue-600">
                      {r.depositAmount ? formatPrice(r.depositAmount) : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(r._id, "approve")}
                          className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors"
                        >
                          {t.admin.approve}
                        </button>
                        <button
                          onClick={() => handleAction(r._id, "reject")}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                        >
                          {t.admin.reject}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
