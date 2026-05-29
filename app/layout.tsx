import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Providers from "@/components/layout/Providers"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Rentigo – Immobilier en Tunisie",
  description: "Trouvez le bien idéal en Tunisie. Appartements, villas, locaux commerciaux à vendre ou à louer.",
  keywords: "immobilier, tunisie, appartement, villa, location, vente, rentigo",
  openGraph: {
    title: "Rentigo – Immobilier en Tunisie",
    description: "Trouvez le bien idéal en Tunisie.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
