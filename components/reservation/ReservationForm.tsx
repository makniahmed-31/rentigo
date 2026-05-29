"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Property } from "@/types"
import { formatPrice, buildWhatsAppLink } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import { Calendar, Clock, CreditCard, MessageSquare, Check } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"

const BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"
const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+21670123456"

interface Props {
  property: Property
}

export default function ReservationForm({ property }: Props) {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<"form" | "success">("form")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    requestType: property.type === "rent" ? "reservation" : "visit",
    visitDate: "",
    visitTime: "10:00",
    startDate: "",
    duration: "12",
    paymentMethod: "virement",
    notes: "",
    acceptTerms: false,
  })

  const depositAmount = property.price * 0.3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return router.push("/auth/login")
    if (!formData.acceptTerms) return toast.error("Veuillez accepter les conditions générales")

    setSubmitting(true)
    try {
      const res = await fetch(`${BACKEND}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          property: property._id,
          requestType: formData.requestType,
          visitDate: formData.visitDate || undefined,
          visitTime: formData.visitTime || undefined,
          startDate: formData.startDate || undefined,
          duration: formData.duration ? Number(formData.duration) : undefined,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      })
      if (!res.ok) throw new Error("Erreur lors de la soumission")
      setStep("success")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "success") {
    const waMsg = `${t.reservation.whatsappMessage}${property.title} - ${formatPrice(depositAmount)}`
    return (
      <div className="text-center py-10 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t.reservation.successTitle}</h3>
        <p className="text-gray-500 mb-6">{t.reservation.successMessage}</p>
        <a
          href={buildWhatsAppLink(ADMIN_PHONE, waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors mb-4"
        >
          <MessageSquare className="w-5 h-5" />
          Suivre sur WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/reservations" className="text-sm text-primary-600 hover:underline">
            Voir mes demandes →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Property summary */}
      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
        {property.images?.[0]?.url && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <Image src={property.images[0].url} alt="" fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{property.title}</p>
          <p className="text-primary-600 font-bold text-sm">{formatPrice(property.price)}{property.type === "rent" && "/mois"}</p>
          <p className="text-xs text-gray-500">{property.location?.city}, {property.location?.governorate}</p>
        </div>
      </div>

      {/* Request type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Type de demande</label>
        <div className="grid grid-cols-2 gap-2">
          {(["visit", "reservation"] as const).map(rt => (
            <button
              key={rt}
              type="button"
              onClick={() => setFormData(f => ({ ...f, requestType: rt }))}
              className={`py-2.5 text-sm font-medium rounded-xl border-2 transition-colors ${
                formData.requestType === rt
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {rt === "visit" ? "Demande de visite" : "Réservation"}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          {formData.requestType === "visit" ? t.reservation.visitDate : t.reservation.startDate}
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={formData.requestType === "visit" ? formData.visitDate : formData.startDate}
          onChange={e => setFormData(f => formData.requestType === "visit"
            ? { ...f, visitDate: e.target.value }
            : { ...f, startDate: e.target.value }
          )}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Time (visit only) */}
      {formData.requestType === "visit" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-primary-500" />
            {t.reservation.visitTime}
          </label>
          <select
            value={formData.visitTime}
            onChange={e => setFormData(f => ({ ...f, visitTime: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"].map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      )}

      {/* Duration (rent reservation) */}
      {formData.requestType === "reservation" && property.type === "rent" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.reservation.duration}</label>
          <select
            value={formData.duration}
            onChange={e => setFormData(f => ({ ...f, duration: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {["1","3","6","12","24"].map(m => (
              <option key={m} value={m}>{m} mois</option>
            ))}
          </select>
        </div>
      )}

      {/* Payment method (reservation only) */}
      {formData.requestType === "reservation" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 text-primary-500" />
            {t.reservation.paymentMethod}
          </label>
          <div className="space-y-2">
            {(["virement","cash","mandat-minute"] as const).map(m => (
              <label key={m} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m}
                  checked={formData.paymentMethod === m}
                  onChange={() => setFormData(f => ({ ...f, paymentMethod: m }))}
                  className="text-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  {m === "virement" ? t.reservation.virement : m === "cash" ? t.reservation.cash : t.reservation.mandatMinute}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 text-primary-500" />
          {t.reservation.notes}
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
          placeholder="Votre message..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Summary */}
      {formData.requestType === "reservation" && (
        <div className="bg-primary-50 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm">{t.reservation.summary}</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t.reservation.total}</span>
            <span className="font-semibold">{formatPrice(property.price)}{property.type === "rent" && "/mois"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t.reservation.deposit}</span>
            <span className="font-bold text-primary-600">{formatPrice(depositAmount)}</span>
          </div>
        </div>
      )}

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={e => setFormData(f => ({ ...f, acceptTerms: e.target.checked }))}
          className="mt-0.5 text-primary-600 rounded"
        />
        <span className="text-xs text-gray-500">{t.reservation.terms}</span>
      </label>

      {!session ? (
        <Link
          href="/auth/login"
          className="block w-full py-3 text-center text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
        >
          Se connecter pour réserver
        </Link>
      ) : (
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Envoi en cours..." : t.reservation.submit}
        </button>
      )}
    </form>
  )
}
