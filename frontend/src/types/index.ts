export type EventType = 'MARIAGE' | 'FETE_PRIVEE' | 'ANNIVERSAIRE'
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED'
export type ItemStatus = 'DRAFT' | 'PUBLISHED'
export type CategoryScope = 'CATALOGUE' | 'PORTFOLIO'

export interface Category {
  id: number
  key: string
  name: string
  description: string | null
  scope: CategoryScope
  createdAt: string
}

export interface Label {
  id: number
  key: string
  name: string
  description: string | null
  createdAt: string
}

export interface ContactMessage {
  id: number
  firstName: string
  lastName: string
  email: string
  eventType: string
  eventDate: string
  message: string
  read: boolean
  createdAt: string
}

export interface PortfolioItem {
  id: number
  title: string
  location: string
  imageUrl: string
  category: Category | null
  description: string
  status: ItemStatus
  createdAt: string
}

export interface Reservation {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: EventType
  eventDate: string
  guestCount: number
  budget: number
  message: string
  status: ReservationStatus
  createdAt: string
}

export interface NewsletterSubscriber {
  id: number
  email: string
  subscribedAt: string
  active: boolean
}

export interface CatalogueItem {
  id: number
  name: string
  imageUrl: string
  description: string
  category: Category | null
  labels: Label[]
  status: ItemStatus
}

export interface NewsletterTemplate {
  id: number
  name: string
  designJson: string
  htmlContent: string
  createdAt: string
}

export interface NewsletterCampaign {
  id: number
  subject: string
  recipientCount: number
  sentAt: string
}

export interface AuthResponse {
  token: string
  username: string
}

export interface Stats {
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  newsletterSubscribers: number
  unreadContacts: number
}

export interface ReservationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: EventType | ''
  eventDate: string
  guestCount: string
  budget: string
  message: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  eventType: string
  eventDate: string
  message: string
}
