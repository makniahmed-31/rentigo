"use client"
import { useLanguage } from "@/contexts/LanguageContext"
import { Shield, Users, Home, Award } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">À propos de Rentigo</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Rentigo est la plateforme immobilière de référence en Tunisie qui vous permet de trouver facilement le bien qui vous correspond grâce à nos filtres avancés.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-blue-50 rounded-3xl p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Notre mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Simplifier vos recherches et vous accompagner à chaque étape de votre projet immobilier. Que vous souhaitiez acheter, louer ou investir sur plan, Rentigo est là pour vous offrir une expérience transparente et sécurisée.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
        {[
          { icon: Shield, title: "Sécurité", desc: "Toutes nos annonces sont vérifiées manuellement" },
          { icon: Users, title: "Accompagnement", desc: "Une équipe dédiée pour vous aider" },
          { icon: Home, title: "Qualité", desc: "Des biens sélectionnés avec soin" },
          { icon: Award, title: "Excellence", desc: "+8000 clients satisfaits en Tunisie" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "2,500+", label: "Biens disponibles" },
          { value: "8,000+", label: "Clients satisfaits" },
          { value: "1,200+", label: "Transactions réalisées" },
          { value: "100%", label: "Annonces vérifiées" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-blue-600 rounded-2xl p-5 text-white text-center">
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-blue-100 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
