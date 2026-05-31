"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { TUNISIAN_GOVERNORATES, PROPERTY_AMENITIES } from "@/lib/utils"
import { Upload, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

type FormData = {
  title: string; titleFr: string; titleEn: string;
  descriptionFr: string; descriptionEn: string;
  type: string; saleType: string; rentType: string; propertyType: string;
  price: string; surface: string; rooms: string; bathrooms: string; floor: string;
  parking: boolean; furnished: boolean;
  address: string; city: string; governorate: string; lat: string; lng: string;
  amenities: string[]; isVerified: boolean; isFeatured: boolean;
}

export default function EditPropertyPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([])
  const [form, setForm] = useState<FormData>({
    title: "", titleFr: "", titleEn: "",
    descriptionFr: "", descriptionEn: "",
    type: "sale", saleType: "immediate", rentType: "long-term", propertyType: "apartment",
    price: "", surface: "", rooms: "", bathrooms: "", floor: "",
    parking: false, furnished: false,
    address: "", city: "", governorate: "Tunis", lat: "", lng: "",
    amenities: [], isVerified: false, isFeatured: false,
  })

  const set = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!id) return
    fetch(`${BACKEND}/api/properties/${id}`)
      .then(r => r.json())
      .then(d => {
        const p = d.property || d
        setForm({
          title: p.title || "",
          titleFr: p.titleFr || "",
          titleEn: p.titleEn || "",
          descriptionFr: p.descriptionFr || p.description || "",
          descriptionEn: p.descriptionEn || "",
          type: p.type || "sale",
          saleType: p.saleType || "immediate",
          rentType: p.rentType || "long-term",
          propertyType: p.propertyType || "apartment",
          price: p.price != null ? String(p.price) : "",
          surface: p.surface != null ? String(p.surface) : "",
          rooms: p.rooms != null ? String(p.rooms) : "",
          bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
          floor: p.floor != null ? String(p.floor) : "",
          parking: p.parking || false,
          furnished: p.furnished || false,
          address: p.location?.address || "",
          city: p.location?.city || "",
          governorate: p.location?.governorate || "Tunis",
          lat: p.location?.lat != null ? String(p.location.lat) : "",
          lng: p.location?.lng != null ? String(p.location.lng) : "",
          amenities: p.amenities || [],
          isVerified: p.isVerified || false,
          isFeatured: p.isFeatured || false,
        })
        setImages(p.images || [])
      })
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }, [id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !session) return
    setUploading(true)
    try {
      const data = new FormData()
      Array.from(e.target.files).forEach(f => data.append("images", f))
      const res = await fetch(`${BACKEND}/api/properties/upload/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: data,
      })
      const { images: uploaded } = await res.json()
      setImages(prev => [...prev, ...uploaded])
    } catch {
      toast.error("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setSubmitting(true)
    try {
      const body = {
        title: form.title || form.titleFr,
        titleFr: form.titleFr, titleEn: form.titleEn,
        descriptionFr: form.descriptionFr, descriptionEn: form.descriptionEn,
        description: form.descriptionFr,
        type: form.type, saleType: form.saleType, rentType: form.rentType,
        propertyType: form.propertyType,
        price: Number(form.price),
        surface: form.surface ? Number(form.surface) : undefined,
        rooms: form.rooms ? Number(form.rooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        floor: form.floor ? Number(form.floor) : undefined,
        parking: form.parking, furnished: form.furnished,
        location: {
          address: form.address, city: form.city, governorate: form.governorate,
          lat: form.lat ? Number(form.lat) : undefined,
          lng: form.lng ? Number(form.lng) : undefined,
        },
        amenities: form.amenities,
        images,
        isVerified: form.isVerified, isFeatured: form.isFeatured,
      }
      const res = await fetch(`${BACKEND}/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success("Bien modifié avec succès")
      router.push("/admin/properties")
    } catch {
      toast.error("Erreur lors de la modification")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/properties" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le bien</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Images */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Photos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">{uploading ? "Upload..." : "Ajouter"}</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Titles */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Titre & Description</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Titre (FR) *</label>
                <input required value={form.titleFr} onChange={e => set("titleFr", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Titre (EN)</label>
                <input value={form.titleEn} onChange={e => set("titleEn", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description (FR)</label>
              <textarea rows={4} value={form.descriptionFr} onChange={e => set("descriptionFr", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description (EN)</label>
              <textarea rows={3} value={form.descriptionEn} onChange={e => set("descriptionEn", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Détails</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Prix (TND) *", key: "price" as const, required: true },
                { label: "Surface (m²)", key: "surface" as const },
                { label: "Chambres", key: "rooms" as const },
                { label: "Salle de bain", key: "bathrooms" as const },
                { label: "Étage", key: "floor" as const },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                  <input
                    type="number"
                    required={required}
                    min={0}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.parking} onChange={e => set("parking", e.target.checked)} className="text-primary-600 rounded" />
                <span className="text-sm text-gray-700">Parking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.furnished} onChange={e => set("furnished", e.target.checked)} className="text-primary-600 rounded" />
                <span className="text-sm text-gray-700">Meublé</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Équipements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROPERTY_AMENITIES.map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={e => set("amenities", e.target.checked
                      ? [...form.amenities, a]
                      : form.amenities.filter(x => x !== a)
                    )}
                    className="text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Transaction type */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Type de transaction</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Transaction</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>
            {form.type === "sale" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type de vente</label>
                <select value={form.saleType} onChange={e => set("saleType", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="immediate">Immédiat</option>
                  <option value="sur-plan">Sur plan</option>
                </select>
              </div>
            )}
            {form.type === "rent" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type de location</label>
                <select value={form.rentType} onChange={e => set("rentType", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="long-term">Long terme</option>
                  <option value="short-term">Court terme</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Catégorie</label>
              <select value={form.propertyType} onChange={e => set("propertyType", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {["apartment","villa","house","commercial","terrain","office"].map(pt => (
                  <option key={pt} value={pt}>{t.property[pt as keyof typeof t.property]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-bold text-gray-900">Localisation</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gouvernorat *</label>
              <select required value={form.governorate} onChange={e => set("governorate", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {TUNISIAN_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ville</label>
              <input value={form.city} onChange={e => set("city", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Adresse</label>
              <input value={form.address} onChange={e => set("address", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Latitude</label>
                <input type="number" step="any" value={form.lat} onChange={e => set("lat", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Longitude</label>
                <input type="number" step="any" value={form.lng} onChange={e => set("lng", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-bold text-gray-900">Options</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isVerified} onChange={e => set("isVerified", e.target.checked)} className="text-primary-600 rounded" />
              <span className="text-sm text-gray-700">Annonce vérifiée</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} className="text-primary-600 rounded" />
              <span className="text-sm text-gray-700">Mise en avant</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  )
}
