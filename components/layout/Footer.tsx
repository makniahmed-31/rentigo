"use client"
import Link from "next/link"
import { Home, Phone, Mail, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Rentigo</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{t.footer.description}</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-white text-xs font-bold">f</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors text-white text-xs font-bold">in</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors text-white text-xs font-bold">yt</a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.links}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/properties?type=sale", label: t.nav.buy },
                { href: "/properties?type=rent", label: t.nav.rent },
                { href: "/properties?saleType=sur-plan", label: t.nav.surplan },
                { href: "/map", label: "Carte des biens" },
                { href: "/about", label: t.nav.about },
                { href: "/contact", label: t.nav.contact },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+21670123456" className="hover:text-white transition-colors">+216 70 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:contact@rentigo.tn" className="hover:text-white transition-colors">contact@rentigo.tn</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Les Berges du Lac, Tunis, Tunisie</span>
              </li>
            </ul>
          </div>

          {/* Payment & availability */}
          <div>
            <h3 className="text-white font-semibold mb-4">Disponible en</h3>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1.5 bg-red-700 text-white text-xs font-medium rounded-lg">TN</span>
              <span className="px-3 py-1.5 bg-blue-700 text-white text-xs font-medium rounded-lg">FR</span>
              <span className="px-3 py-1.5 bg-blue-800 text-white text-xs font-medium rounded-lg">EN</span>
            </div>
            <h3 className="text-white font-semibold mb-3">Paiement</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Virement bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Mandat Minute</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Acompte 30% du prix total</p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Rentigo. {t.footer.rights}.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
