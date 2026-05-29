export function formatPrice(amount: number, currency = "TND") {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date, locale = "fr-FR") {
  return new Date(date).toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })
}

export function buildWhatsAppLink(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, "")
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

export const TUNISIAN_GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
]

export const PROPERTY_AMENITIES = [
  "Piscine", "Parking", "Jardin", "Terrasse", "Balcon", "Ascenseur",
  "Climatisation", "Chauffage central", "Cuisine équipée", "Gardien",
  "Sécurité", "Vue mer", "Vue montagne", "Internet haut débit", "Meublé"
]

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}
