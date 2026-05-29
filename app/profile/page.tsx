"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { User } from "@/types"
import toast from "react-hot-toast"
import Link from "next/link"
import { ClipboardList, Settings, Bell } from "lucide-react"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", language: "fr" })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch(`${BACKEND}/api/users/profile`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(r => r.json())
      .then(u => {
        setUser(u)
        setForm({ name: u.name || "", phone: u.phone || "", language: u.language || "fr" })
      })
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success("Profil mis à jour")
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") return <div className="flex justify-center py-24 text-gray-400">Chargement...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t.profile.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            {session?.user.image ? (
              <Image src={session.user.image} alt="" width={80} height={80} className="rounded-full" />
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {session?.user.name?.[0]}
              </div>
            )}
          </div>
          <h2 className="font-bold text-gray-900">{session?.user.name}</h2>
          <p className="text-sm text-gray-500">{session?.user.email}</p>
          {session?.user.role === "admin" && (
            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Admin</span>
          )}

          <div className="mt-6 w-full space-y-2">
            <Link href="/reservations" className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <ClipboardList className="w-4 h-4 text-blue-500" />
              {t.profile.myReservations}
            </Link>
            <Link href="/profile" className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-gray-700 bg-blue-50 text-blue-700">
              <Settings className="w-4 h-4" />
              {t.profile.personalInfo}
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">{t.profile.personalInfo}</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={session?.user.email || ""}
                disabled
                className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+216 XX XXX XXX"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Langue préférée</label>
              <select
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Enregistrement..." : t.profile.save}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
