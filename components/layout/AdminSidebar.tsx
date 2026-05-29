"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, ClipboardList, CreditCard, Users, Home, BarChart3, X } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/admin/properties", icon: Building2, labelKey: "properties" as const },
  { href: "/admin/reservations", icon: ClipboardList, labelKey: "reservations" as const },
  { href: "/admin/payments", icon: CreditCard, labelKey: "payments" as const },
  { href: "/admin/users", icon: Users, labelKey: "users" as const },
]

interface AdminSidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40 flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Rentigo Admin</span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, labelKey }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {t.admin[labelKey]}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Voir le site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
