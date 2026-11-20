import { ArrowRight, Disc3, Info, Mic2 } from 'lucide-react'
import { useApp } from '../i18n'
import { useAppState } from '../lib/store'
import { PRICE_ALBUM, PRICE_SINGLE } from '../data/constants'
import { fcfa } from '../lib/format'
import type { Page } from '../types'

export default function Home({ go }: { go: (p: Page) => void }) {
  const { t } = useApp()
  const { config } = useAppState()
  return (
    <div className="space-y-12">
      <section className="pt-10">
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-6xl">{t('heroTitle')}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted">{t('heroSub')}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="btn btn-primary !min-h-[56px] text-base" onClick={() => go('register')}>
            <Disc3 size={20} />{t('ctaRegister')}<ArrowRight size={18} />
          </button>
          <button className="btn btn-ghost !min-h-[56px] text-base" onClick={() => go('studio')}>
            <Mic2 size={20} />{t('ctaStudio')}<ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">{t('promoTitle')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[{ k: 'single' as const, p: PRICE_SINGLE }, { k: 'album' as const, p: PRICE_ALBUM }].map((x) => (
            <div key={x.k} className="card p-6">
              <p className="text-muted">{t(x.k)}</p>
              <p className="mt-1 font-display text-4xl font-extrabold">{fcfa(x.p)}</p>
              <span className="mt-3 inline-block rounded-full bg-brand px-3 py-1 text-sm font-semibold text-nox">{t('promoTag')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card border-l-4 !border-l-alert p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Info size={22} className="text-alert" />{t('transparencyTitle')}</h2>
        <p className="mt-3 max-w-3xl">{t('transparencyText')}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">{t('versionsTitle')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-nox">V1</span>
            <p className="mt-3 font-semibold">{t('v1Live')}</p>
            <a className="btn btn-ghost mt-4" href={config.v1Url} target="_blank" rel="noopener noreferrer">{t('v1Open')}<ArrowRight size={18} /></a>
          </div>
          <div className="card p-6">
            <span className="rounded-full border border-line px-3 py-1 text-sm font-semibold">V2</span>
            <p className="mt-3 font-semibold">{t('v2Soon')}</p>
            <button className="btn btn-ghost mt-4" onClick={() => go('events')}>{t('navEvents')}<ArrowRight size={18} /></button>
          </div>
        </div>
      </section>
    </div>
  )
}
