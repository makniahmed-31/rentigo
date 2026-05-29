"use client"
import { Building2, ClipboardList, Clock, TrendingUp, Users, DollarSign } from "lucide-react"
import { AdminStats } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DashboardStats({ stats }: { stats: AdminStats }) {
  const { t } = useLanguage()

  const cards = [
    {
      title: t.admin.totalProperties,
      value: stats.totalProperties,
      sub: `${stats.availableProperties} disponibles`,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: t.admin.totalReservations,
      value: stats.totalReservations,
      sub: `${stats.monthlyReservations} ce mois`,
      icon: ClipboardList,
      color: "bg-purple-500",
    },
    {
      title: t.admin.pendingReservations,
      value: stats.pendingReservations,
      sub: "En attente de confirmation",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      sub: "Clients inscrits",
      icon: Users,
      color: "bg-pink-500",
    },
    {
      title: t.admin.revenue,
      value: formatPrice(stats.revenue),
      sub: `${stats.approvedReservations} confirmées`,
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ title, value, sub, icon: Icon, color }) => (
        <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  )
}
