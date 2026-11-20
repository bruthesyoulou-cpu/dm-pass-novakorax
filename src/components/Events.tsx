import { CalendarDays, Mic, MessageCircleQuestion } from 'lucide-react'
import { useApp } from '../i18n'
import { useAppState } from '../lib/store'
import { EVENT_UTC, EVENT_ZONES } from '../data/constants'

export default function Events() {
  const { t, lang } = useApp()
  const { config } = useAppState()
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
  const timeIn = (tz: string) =>
    new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date(EVENT_UTC))
  const dayIn = (tz: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: tz }).format(new Date(EVENT_UTC))

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t('eventsTitle')}</h1>

      <section className="card mt-8 p-6 sm:p-8">
        <h2 className="text-2xl font-bold sm:text-4xl">{t('eventHeadline')}</h2>
        <p className="mt-3 flex items-center gap-2 text-lg font-semibold"><CalendarDays className="text-brand" size={22} />{t('eventDate')}</p>

        <h3 className="mt-6 text-lg font-bold">{t('eventTimes')}</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_ZONES.map((z, i) => (
            <li key={z.id} className={`rounded-xl border p-4 ${i < 2 ? 'border-brand bg-brand/10' : 'border-line'}`}>
              <p className="text-sm text-muted">{t(z.key)}</p>
              <p className="font-display text-3xl font-extrabold">{timeIn(z.id)}</p>
              <p className="text-sm text-muted">{dayIn(z.id)}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-lg font-bold">{t('programTitle')}</h3>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-3"><Mic size={20} className="mt-0.5 shrink-0 text-brand" />{t('prog1')}</li>
          <li className="flex items-start gap-3"><MessageCircleQuestion size={20} className="mt-0.5 shrink-0 text-brand" />{t('prog2')}</li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a className="btn btn-primary" href={config.tiktok} target="_blank" rel="noopener noreferrer">{t('openTiktok')}</a>
          <a className="btn btn-ghost" href={config.v1Url} target="_blank" rel="noopener noreferrer">{t('openV1')}</a>
        </div>
      </section>
    </div>
  )
}
