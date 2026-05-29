"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { User } from "@/types"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export default function AdminUsersPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!session) return
    try {
      const res = await fetch(`${BACKEND}/api/admin/users`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      const d = await res.json()
      setUsers(d.users || [])
      setTotal(d.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [session])

  const toggleRole = async (id: string, currentRole: string) => {
    if (!session || id === session.user.id) return
    const newRole = currentRole === "admin" ? "user" : "admin"
    if (!confirm(`Changer le rôle de cet utilisateur en "${newRole}" ?`)) return
    try {
      await fetch(`${BACKEND}/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ role: newRole }),
      })
      toast.success("Rôle mis à jour")
      load()
    } catch { toast.error("Erreur") }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">{t.admin.users} ({total})</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Utilisateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Téléphone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Inscription</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <Image src={u.image} alt="" width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{u.name?.[0]}</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{(u as unknown as { createdAt: string }).createdAt ? formatDate((u as unknown as { createdAt: string }).createdAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRole(u._id, u.role)}
                        disabled={u._id === session?.user.id}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                      >
                        {u.role === "admin" ? "→ User" : "→ Admin"}
                      </button>
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
