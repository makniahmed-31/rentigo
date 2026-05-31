import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/home/HowItWorks";
import StatsBar from "@/components/home/StatsBar";
import Link from "next/link";
import { Home } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <HeroSection />

      {/* Featured properties carousels */}
      <FeaturedProperties
        title="Biens d'exception"
        apiUrl="/api/properties/featured"
      />

      {/* Features strip */}
      <WhyUs />

      <div className="h-px bg-gray-100 max-w-7xl mx-auto w-full" />

      <FeaturedProperties
        title="Biens en vedette"
        apiUrl="/api/properties?isFeatured=true&limit=8"
      />

      {/* CTA Banner */}
      <section className="py-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-primary-700 rounded-3xl overflow-hidden px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-xl font-bold mb-1">
                Vous avez un bien à vendre ou à louer ?
              </h2>
              <p className="text-primary-200 text-sm">
                Publiez votre annonce gratuitement et touchez des milliers de
                clients potentiels.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <Home className="w-7 h-7 text-white" />
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors text-sm"
              >
                Déposer une annonce
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <StatsBar />
    </div>
  );
}
