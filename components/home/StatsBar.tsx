"use client";
import { Home, Users, CheckCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
  { icon: Home, value: "2,500+", labelKey: "properties" as const },
  { icon: Users, value: "8,000+", labelKey: "clients" as const },
  { icon: CheckCircle, value: "1,200+", labelKey: "sold" as const },
  { icon: ShieldCheck, value: "100%", labelKey: "verified" as const },
];

export default function StatsBar() {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, labelKey }) => (
            <div key={labelKey} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{t.stats[labelKey]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
