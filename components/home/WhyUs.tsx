"use client";
import {
  Shield,
  Calendar,
  MessageCircle,
  CreditCard,
  Headphones,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhyUs() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, title: t.features.verified, desc: t.features.verifiedDesc },
    { icon: Calendar, title: t.features.booking, desc: t.features.bookingDesc },
    {
      icon: MessageCircle,
      title: t.features.whatsapp,
      desc: t.features.whatsappDesc,
    },
    {
      icon: CreditCard,
      title: t.features.payment,
      desc: t.features.paymentDesc,
    },
    {
      icon: Headphones,
      title: t.features.support,
      desc: t.features.supportDesc,
    },
  ];

  return (
    <section className="py-12 bg-primary-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {title}
              </h4>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
