"use client"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { buildWhatsAppLink } from "@/lib/utils"
import toast from "react-hot-toast"

const ADMIN_PHONE = "+21670123456"

export default function ContactPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Message envoyé ! Nous vous répondrons dans les plus brefs délais.")
    setForm({ name: "", email: "", phone: "", message: "" })
    setSending(false)
  }

  const waMsg = `Bonjour Rentigo, je souhaite obtenir plus d'informations sur vos biens immobiliers.`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Contactez-nous</h1>
        <p className="text-gray-500">Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Nos coordonnées</h2>
            {[
              { icon: Phone, label: "+216 70 123 456", href: "tel:+21670123456" },
              { icon: Phone, label: "+212 70 123 456", href: "tel:+21270123456" },
              { icon: Mail, label: "contact@rentigo.tn", href: "mailto:contact@rentigo.tn" },
              { icon: MapPin, label: "Les Berges du Lac, Tunis, Tunisie", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </a>
            ))}
          </div>

          <a
            href={buildWhatsAppLink(ADMIN_PHONE, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Nous contacter sur WhatsApp
          </a>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
