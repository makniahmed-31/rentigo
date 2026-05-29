export interface PropertyImage {
  url: string
  publicId?: string
}

export interface PropertyLocation {
  address?: string
  city?: string
  governorate?: string
  lat?: number
  lng?: number
}

export interface Property {
  _id: string
  title: string
  titleFr?: string
  titleEn?: string
  description?: string
  descriptionFr?: string
  descriptionEn?: string
  type: "rent" | "sale"
  saleType?: "immediate" | "sur-plan"
  rentType?: "long-term" | "short-term"
  propertyType: "apartment" | "villa" | "house" | "commercial" | "terrain" | "office"
  status: "available" | "rented" | "sold" | "pending"
  price: number
  surface?: number
  rooms?: number
  bathrooms?: number
  floor?: number
  parking?: boolean
  furnished?: boolean
  location?: PropertyLocation
  amenities?: string[]
  images?: PropertyImage[]
  isVerified?: boolean
  isFeatured?: boolean
  agent?: User
  views?: number
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
  phone?: string
  language?: "fr" | "en"
}

export interface Reservation {
  _id: string
  property: Property
  user: User
  requestType: "visit" | "reservation"
  visitDate?: string
  visitTime?: string
  startDate?: string
  endDate?: string
  duration?: number
  totalAmount?: number
  depositAmount?: number
  paymentMethod?: "virement" | "cash" | "mandat-minute"
  status: "pending" | "approved" | "rejected" | "cancelled"
  notes?: string
  adminNotes?: string
  whatsappSent?: boolean
  depositPaid?: boolean
  createdAt: string
  updatedAt: string
}

export interface Payment {
  _id: string
  reservation: Reservation
  user: User
  property: Property
  amount: number
  type: "deposit" | "full" | "installment"
  method: "virement" | "cash" | "mandat-minute"
  status: "pending" | "confirmed" | "rejected"
  reference?: string
  confirmedBy?: User
  confirmedAt?: string
  notes?: string
  createdAt: string
}

export interface AdminStats {
  totalProperties: number
  availableProperties: number
  totalReservations: number
  pendingReservations: number
  approvedReservations: number
  totalUsers: number
  revenue: number
  monthlyReservations: number
  recentReservations: Reservation[]
  last6Months: { month: string; reservations: number }[]
  propertyTypeStats: { _id: string; count: number }[]
  reservationsByStatus: { _id: string; count: number }[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pages: number
}
