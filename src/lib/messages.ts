import type { Category, Format } from '../types'
import type { Key } from '../i18n'
import { CATEGORY_FIELDS } from '../data/constants'
import { fcfa } from './format'

type T = (k: Key) => string
const catKey: Record<Category, Key> = {
  independent: 'catIndependent', label: 'catLabel', producer: 'catProducer', beatmaker: 'catBeatmaker'
}
export const categoryLabel = (t: T, c: Category) => t(catKey[c])

// Messages en texte simple : aucune puce markdown, aucun astérisque.
export function registerMessage(t: T, d: {
  format: Format; price: number; title: string; category: Category; style: string; fields: Record<string, string>
}) {
  const lines: string[] = [t('msgRegIntro'), '']
  lines.push(`${t('msgFormat')} : ${d.format === 'single' ? t('single') : t('album')} (${fcfa(d.price)})`)
  lines.push(`${t('fTitle')} : ${d.title}`)
  lines.push(`${t('fCategory')} : ${categoryLabel(t, d.category)}`)
  lines.push(`${t('fStyle')} : ${d.style}`)
  for (const f of CATEGORY_FIELDS[d.category]) {
    const v = (d.fields[f.key] ?? '').trim()
    if (v) lines.push(`${t(f.key as Key)} : ${v}`)
  }
  lines.push('', t('msgRegOutro'))
  return lines.join('\n')
}

export function bookingMessage(t: T, d: {
  style: string; price: number; dateLabel: string; slot: string; artist: string; whatsapp: string; project: string; notes: string
}) {
  const lines: string[] = [t('msgBookIntro'), '']
  lines.push(`${t('artistName')} : ${d.artist}`)
  lines.push(`${t('whatsappNumber')} : ${d.whatsapp}`)
  lines.push(`${t('projectTitle')} : ${d.project}`)
  lines.push(`${t('msgStyle')} : ${d.style}`)
  lines.push(`${t('msgPrice')} : ${fcfa(d.price)}`)
  lines.push(`${t('msgDate')} : ${d.dateLabel}`)
  lines.push(`${t('msgSlot')} : ${d.slot}`)
  if (d.notes.trim()) lines.push(`${t('notes')} : ${d.notes.trim()}`)
  lines.push('', t('msgBookOutro'))
  return lines.join('\n')
}
