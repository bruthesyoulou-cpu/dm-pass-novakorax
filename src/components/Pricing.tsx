import { Mail, MessageCircle, Moon, Send } from 'lucide-react'
import { useApp, type Key } from '../i18n'
import { useAppState } from '../lib/store'
import { PRICE_ALBUM, PRICE_SINGLE, STUDIO_STYLES, hoursFor } from '../data/constants'
import { fcfa, hourLabel } from '../lib/format'

const DAYS: { d: number; k: Key }[] = [
  { d: 1, k: 'mon' }, { d: 2, k: 'tue' }, { d: 3, k: 'wed' }, { d: 4, k: 'thu' }, { d: 5, k: 'fri' }, { d: 6, k: 'sat' }, { d: 0, k: 'sun' }
]

export default function Pricing() {
  const { t } = useApp()
  const { config } = useAppState()
  const contacts = [
    { label: t('cStudioWa'), href: config.waStudio, icon: <MessageCircle size={18} />, text: config.waStudio },
    { label: t('cNovaWa'), href: config.waNovakorax, icon: <MessageCircle size={18} />, text: config.waNovakorax },
    { label: t('cNovaTg'), href: config.telegramNovakorax, icon: <Send size={18} />, text: config.telegramNovakorax },
    { label: t('cNovaMail'), href: `mailto:${config.emailNovakorax}`, icon: <Mail size={18} />, text: config.emailNovakorax }
  ]
  return (
    <div className="space-y-10 pt-8">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t('pricingTitle')}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-bold">{t('studioRates')}</h2>
          <ul className="mt-4 divide-y divide-line">
            {STUDIO_STYLES.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3"><span className="font-semibold">{s.id}</span><span>{fcfa(s.price)}</span></li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-bold">{t('publishRates')}</h2>
          <ul className="mt-4 divide-y divide-line">
            <li className="flex items-center justify-between gap-3 py-3"><span className="font-semibold">{t('single')}</span><span>{fcfa(PRICE_SINGLE)}</span></li>
            <li className="flex items-center justify-between gap-3 py-3"><span className="font-semibold">{t('album')}</span><span>{fcfa(PRICE_ALBUM)}</span></li>
          </ul>
          <p className="mt-3 text-sm text-muted">{t('promoTag')}</p>
        </section>
      </div>

      <section className="card p-6">
        <h2 className="text-xl font-bold">{t('scheduleTitle')}</h2>
        <ul className="mt-4 divide-y divide-line">
          {DAYS.map(({ d, k }) => {
            const [o, c] = hoursFor(d)
            return <li key={d} className="flex items-center justify-between gap-3 py-3"><span className="font-semibold">{t(k)}</span><span>{hourLabel(o)} - {hourLabel(c)}</span></li>
          })}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-muted"><Moon size={18} className="mt-0.5 shrink-0 text-brand" />{t('eveningNote')}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold">{t('contactsTitle')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="card block p-4 hover:border-brand">
              <span className="flex items-center gap-2 font-semibold">{c.icon}{c.label}</span>
              <span className="mt-1 block break-all text-sm text-muted">{c.text.replace('mailto:', '')}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
