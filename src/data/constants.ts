import type { Category, Config } from '../types'

export const DEFAULT_CONFIG: Config = {
  waNovakorax: 'https://wa.me/message/KFK5ETUTFPRVD1',
  telegramNovakorax: 'https://t.me/Bruthesmyguel',
  emailNovakorax: 'contact@novakorax.com',
  waStudio: 'https://wa.me/c/242064121686',
  tiktok: 'https://www.tiktok.com/@novakorax.auth?_r=1&_t=ZS-9BXmGD6uFim',
  v1Url: 'https://music.novakorax.com/',
  // À CHANGER dès la première connexion (voir README)
  pinGeneral: '2026',
  pinStudio: '1234'
}

export const PRICE_SINGLE = 5000
export const PRICE_ALBUM = 10000

export const STUDIO_STYLES = [
  { id: 'RAP', price: 7500 },
  { id: 'AFRO', price: 10000 },
  { id: 'ZOUK', price: 8000 },
  { id: 'TYPIQUE', price: 30000 }
] as const

export const MUSIC_STYLES = [
  'Afrobeats', 'Amapiano', 'Rap/Trap/Drill', 'Rumba Congolaise/Soukous', 'Ndombolo',
  'Zouk/Kompa', 'R&B/Soul', 'Gospel', 'Afro-Pop', 'Musique Typique'
]

export const OTHER = '__other__'

// Champs par catégorie : [clé, requis, type]
export interface FieldDef { key: string; required: boolean; type?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' }
export const CATEGORY_FIELDS: Record<Category, FieldDef[]> = {
  independent: [
    { key: 'legalName', required: true }, { key: 'stageName', required: true },
    { key: 'email', required: true, type: 'email' }, { key: 'phone', required: true, type: 'tel' },
    { key: 'cityCountry', required: true }, { key: 'link', required: false, type: 'url' },
    { key: 'bio', required: false, type: 'textarea' }
  ],
  label: [
    { key: 'legalName', required: true }, { key: 'labelName', required: true },
    { key: 'artistCount', required: true, type: 'number' }, { key: 'rccm', required: false },
    { key: 'email', required: true, type: 'email' }, { key: 'phone', required: true, type: 'tel' },
    { key: 'cityCountry', required: true }
  ],
  producer: [
    { key: 'legalName', required: true }, { key: 'structureName', required: true },
    { key: 'affiliatedStudio', required: false }, { key: 'productionCount', required: true, type: 'number' },
    { key: 'email', required: true, type: 'email' }, { key: 'phone', required: true, type: 'tel' },
    { key: 'cityCountry', required: true }
  ],
  beatmaker: [
    { key: 'legalName', required: true }, { key: 'beatmakerName', required: true },
    { key: 'daw', required: true }, { key: 'catalogLink', required: false, type: 'url' },
    { key: 'email', required: true, type: 'email' }, { key: 'phone', required: true, type: 'tel' },
    { key: 'cityCountry', required: true }
  ]
}

export const STUDIO_ADDRESS = '815 rue Mbemba Pierre, Makélékélé, Brazzaville'
export const MAPS_QUERY = encodeURIComponent('815 rue Mbemba Pierre, Makélékélé, Brazzaville, Congo')

// Dimanche = 0
export function hoursFor(day: number): [number, number] {
  return day === 0 ? [10, 16] : [9, 19]
}

// 24 décembre 2026, 17h00 GMT
export const EVENT_UTC = Date.UTC(2026, 11, 24, 17, 0, 0)
export const EVENT_ZONES = [
  { id: 'Africa/Dakar', key: 'zoneSenegal' },
  { id: 'Africa/Brazzaville', key: 'zoneCongo' },
  { id: 'Europe/Paris', key: 'zoneParis' },
  { id: 'Africa/Lubumbashi', key: 'zoneLubumbashi' },
  { id: 'America/New_York', key: 'zoneNewYork' }
] as const
