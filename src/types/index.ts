export type Lang = 'fr' | 'en' | 'ln'
export type Theme = 'night' | 'cream'
export type Page = 'home' | 'register' | 'studio' | 'pricing' | 'events'
export type Status = 'new' | 'confirmed' | 'done'
export type Category = 'independent' | 'label' | 'producer' | 'beatmaker'
export type Format = 'single' | 'album'

export interface Config {
  waNovakorax: string
  telegramNovakorax: string
  emailNovakorax: string
  waStudio: string
  tiktok: string
  v1Url: string
  pinGeneral: string
  pinStudio: string
}

export interface Submission {
  id: string
  createdAt: number
  status: Status
  format: Format
  title: string
  category: Category
  style: string
  fields: Record<string, string>
  channel: 'whatsapp' | 'telegram' | 'email'
  message: string
}

export interface Booking {
  id: string
  createdAt: number
  status: Status
  style: 'RAP' | 'AFRO' | 'ZOUK' | 'TYPIQUE'
  price: number
  date: string
  slot: string
  artist: string
  whatsapp: string
  project: string
  notes: string
  message: string
}

export interface AppState {
  config: Config
  submissions: Submission[]
  bookings: Booking[]
}
