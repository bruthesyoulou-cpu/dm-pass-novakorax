import { useMemo, useState } from 'react'
import { MapPin, MessageCircle, Moon } from 'lucide-react'
import { useApp } from '../i18n'
import { addBooking, uid, useAppState } from '../lib/store'
import { MAPS_QUERY, STUDIO_ADDRESS, STUDIO_STYLES, hoursFor } from '../data/constants'
import { bookingMessage } from '../lib/messages'
import { dispatch, type SendResult } from '../lib/send'
import { dayOfWeek, fcfa, formatDate, hourLabel, todayISO } from '../lib/format'
import type { Booking } from '../types'
import SendDialog from './SendDialog'

const EVENING = '__evening__'

export default function Studio() {
  const { t, lang } = useApp()
  const { config } = useAppState()
  const [style, setStyle] = useState<Booking['style']>('RAP')
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [custom, setCustom] = useState('')
  const [artist, setArtist] = useState('')
  const [wa, setWa] = useState('')
  const [project, setProject] = useState('')
  const [notes, setNotes] = useState('')
  const [attest, setAttest] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState<SendResult | null>(null)

  const slots = useMemo(() => {
    if (!date) return []
    const [open, close] = hoursFor(dayOfWeek(date))
    const out: string[] = []
    for (let h = open; h < close; h++) out.push(`${hourLabel(h)} - ${hourLabel(h + 1)}`)
    return out
  }, [date])

  const price = STUDIO_STYLES.find((s) => s.id === style)!.price

  const submit = () => {
    const slotText = slot === EVENING ? custom.trim() : slot
    const missing: string[] = []
    if (!date) missing.push(t('pickDate'))
    if (!slotText) missing.push(t('pickSlot'))
    if (!artist.trim()) missing.push(t('artistName'))
    if (!wa.trim()) missing.push(t('whatsappNumber'))
    if (!project.trim()) missing.push(t('projectTitle'))
    if (missing.length) { setError(`${t('errRequired')} ${missing.join(', ')}.`); return }
    if (!attest) { setError(t('errAttest')); return }
    setError('')
    const slotFull = slot === EVENING ? `${t('privateEvening')} : ${slotText}` : slotText
    const message = bookingMessage(t, {
      style, price, dateLabel: formatDate(date, lang), slot: slotFull,
      artist: artist.trim(), whatsapp: wa.trim(), project: project.trim(), notes
    })
    const result = dispatch('whatsapp', config.waStudio, message, t('msgBookSubject'))
    addBooking({
      id: uid(), createdAt: Date.now(), status: 'new', style, price, date, slot: slotFull,
      artist: artist.trim(), whatsapp: wa.trim(), project: project.trim(), notes: notes.trim(), message
    })
    setSent(result)
  }

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t('studioTitle')}</h1>
      <p className="mt-3 max-w-xl text-muted">{t('studioIntro')}</p>

      <section className="card mt-8 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm text-muted">{t('addressLabel')}</p>
            <p className="flex items-start gap-2 font-semibold"><MapPin size={18} className="mt-1 shrink-0 text-brand" />{STUDIO_ADDRESS}</p>
          </div>
          <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}>{t('openMap')}</a>
        </div>
        <iframe title="Studio DM Record" className="h-64 w-full border-0 sm:h-80" loading="lazy"
          src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`} referrerPolicy="no-referrer-when-downgrade" />
      </section>

      <section className="card mt-8 space-y-6 p-5 sm:p-8">
        <h2 className="text-2xl font-bold">{t('bookTitle')}</h2>

        <fieldset>
          <legend className="mb-2 font-semibold">{t('pickStyle')}</legend>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STUDIO_STYLES.map((s) => (
              <label key={s.id} className={`cursor-pointer rounded-xl border p-4 ${style === s.id ? 'border-brand bg-brand/10' : 'border-line'}`}>
                <input type="radio" className="sr-only" name="style" checked={style === s.id} onChange={() => setStyle(s.id)} />
                <span className="block font-display text-lg font-extrabold">{s.id}</span>
                <span className="block text-sm text-muted">{fcfa(s.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-semibold" htmlFor="date">{t('pickDate')} <span className="text-alert">*</span></label>
            <input id="date" type="date" className="field" min={todayISO()} value={date} onChange={(e) => { setDate(e.target.value); setSlot('') }} />
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">{t('pickSlot')} <span className="text-alert">*</span></p>
          {!date ? <p className="text-muted">{t('pickDateFirst')}</p> : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {slots.map((s) => (
                <button key={s} type="button" onClick={() => setSlot(s)} aria-pressed={slot === s}
                  className={`rounded-lg border px-2 py-2.5 text-sm font-medium ${slot === s ? 'border-brand bg-brand text-nox' : 'border-line hover:bg-bg'}`}>{s}</button>
              ))}
              <button type="button" onClick={() => setSlot(EVENING)} aria-pressed={slot === EVENING}
                className={`col-span-2 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium sm:col-span-3 lg:col-span-5 ${slot === EVENING ? 'border-brand bg-brand text-nox' : 'border-line hover:bg-bg'}`}>
                <Moon size={16} />{t('privateEvening')}
              </button>
            </div>
          )}
          {slot === EVENING && (
            <div className="mt-3">
              <label className="mb-1.5 block font-medium" htmlFor="custom">{t('customSlot')}</label>
              <input id="custom" className="field" value={custom} onChange={(e) => setCustom(e.target.value)} />
              <p className="mt-1 text-sm text-muted">{t('privateEveningHint')}</p>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-medium" htmlFor="artist">{t('artistName')} <span className="text-alert">*</span></label>
            <input id="artist" className="field" value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block font-medium" htmlFor="wa">{t('whatsappNumber')} <span className="text-alert">*</span></label>
            <input id="wa" type="tel" className="field" value={wa} onChange={(e) => setWa(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-medium" htmlFor="project">{t('projectTitle')} <span className="text-alert">*</span></label>
            <input id="project" className="field" value={project} onChange={(e) => setProject(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-medium" htmlFor="notes">{t('notes')}</label>
            <textarea id="notes" rows={3} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
          <input type="checkbox" checked={attest} onChange={(e) => setAttest(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#FFB800]" />
          <span>{t('attestStudio')} <span className="text-alert">*</span></span>
        </label>

        {error && <p role="alert" className="rounded-lg border border-alert bg-alert/10 p-3 font-medium">{error}</p>}

        <button className="btn btn-primary w-full sm:w-auto" onClick={submit}><MessageCircle size={18} />{t('sendBooking')} · {fcfa(price)}</button>
      </section>

      {sent && <SendDialog result={sent} onClose={() => setSent(null)} />}
    </div>
  )
}
