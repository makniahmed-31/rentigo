"use client"
import { Search, Calendar, CheckCircle, MessageCircle, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const steps = [
  { icon: Search, color: "bg-blue-100 text-blue-600", n: 1 },
  { icon: Calendar, color: "bg-purple-100 text-purple-600", n: 2 },
  { icon: CheckCircle, color: "bg-green-100 text-green-600", n: 3 },
  { icon: MessageCircle, color: "bg-orange-100 text-orange-600", n: 4 },
  { icon: Shield, color: "bg-pink-100 text-pink-600", n: 5 },
]

export default function HowItWorks() {
  const { t } = useLanguage()

  const labels = [
    { title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
    { title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
    { title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
    { title: t.howItWorks.step4Title, desc: t.howItWorks.step4Desc },
    { title: t.howItWorks.step5Title, desc: t.howItWorks.step5Desc },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">{t.howItWorks.title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map(({ icon: Icon, color, n }, i) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute left-[calc(50%+30px)] top-8 w-[calc(100%-60px)] h-0.5 bg-gray-200 z-0" />
              )}
              <div className={`relative z-10 w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {n}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{labels[i].title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{labels[i].desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
