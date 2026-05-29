"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Payment } from "@/types"
import { formatDate, formatPrice, cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export default function AdminPaymentsPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const load = async () => {
    if (!session) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: "50" })
      if (filter) params.set("status", filter)
      const res = await fetch(`${BACKEND}/api/payments?${params}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      const d = await res.json()
      setPayments(d.payments || [])
      setTotal(d.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [session, filter])

  const handleConfirm = async (id: string) => {
    if (!session) return
    try {
      await fetch(`${BACKEND}/api/payments/${id}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      toast.success("Paiement confirmé")
      load()
    } catch { toast.error("Erreur") }
  }

  const handleReject = async (id: string) => {
    if (!session) return
    try {
      await fetch(`${BACKEND}/api/payments/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      toast.success("Paiement refusé")
      load()
    } catch { toast.error("Erreur") }
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  const tabs = [
    { label: "Tous", value: "" },
    { label: "En attente", value: "pending" },
    { label: "Confirmés", value: "confirmed" },
    { label: "Refusés", value: "rejected" },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">{t.admin.payments}</h1>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn("pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px",
              filter === tab.value ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Aucun paiement</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Bien</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Montant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Méthode</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-xs">{p.user.name}</p>
                      <p className="text-xs text-gray-400">{p.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs max-w-[150px] truncate">{p.property?.title}</td>
                    <td className="px-4 py-3 font-bold text-primary-600">{formatPrice(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {p.method === "virement" ? "Virement" : p.method === "cash" ? "Cash" : "Mandat Minute"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusStyles[p.status])}>
                        {p.status === "pending" ? "En attente" : p.status === "confirmed" ? "Confirmé" : "Refusé"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "pending" && (
                        <div className="flex gap-1">
                          <button onClick={() => handleConfirm(p._id)} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors">
                            {t.admin.confirm}
                          </button>
                          <button onClick={() => handleReject(p._id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">
                            {t.admin.reject}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {total} paiement{total !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  )
}
