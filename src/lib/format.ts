export const fcfa = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'

export const pad = (n: number) => String(n).padStart(2, '0')
export const hourLabel = (h: number) => `${pad(h)}h00`

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function dayOfWeek(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

export function formatDate(iso: string, lang: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
  return new Date(y, m - 1, d).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
