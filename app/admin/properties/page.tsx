"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"
import { Property } from "@/types"
import { formatPrice, cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

const statusBadge: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  rented: "bg-primary-100 text-primary-700",
  sold: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
}

export default function AdminPropertiesPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const load = async () => {
    if (!session) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" })
      if (search) params.set("search", search)
      const res = await fetch(`${BACKEND}/api/properties?${params}`)
      const d = await res.json()
      setProperties(d.properties || [])
      setTotal(d.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [session, page, search])

  const handleDelete = async (id: string) => {
    if (!session || !confirm("Confirmer la suppression ?")) return
    try {
      await fetch(`${BACKEND}/api/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      toast.success("Bien supprimé")
      load()
    } catch {
      toast.error("Erreur")
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.properties}</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.admin.addProperty}
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un bien..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Bien</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Prix</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Vues</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url ? (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                            <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                        ) : (
                          <div className="w-12 h-10 bg-gray-100 rounded-lg" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.location?.city}, {p.location?.governorate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                        p.type === "sale" ? "bg-green-100 text-green-700" : "bg-primary-100 text-primary-700"
                      )}>
                        {p.type === "sale" ? "Vente" : "Location"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary-600">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusBadge[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.views || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/properties/${p._id}`} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/properties/${p._id}/edit`} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {total} bien{total !== 1 ? "s" : ""} au total
        </div>
      </div>
    </div>
  )
}
