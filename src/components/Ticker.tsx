import { useApp } from '../i18n'

export default function Ticker() {
  const { t } = useApp()
  const items = [t('tick1'), t('tick2'), t('tick3')]
  const row = (suffix: string) =>
    items.map((txt, i) => (
      <span key={suffix + i} className="flex items-center gap-3 whitespace-nowrap px-6 text-sm font-medium">
        <span className="inline-block h-2 w-2 rotate-45 bg-nox" aria-hidden />
        {txt}
      </span>
    ))
  return (
    <div className="ticker overflow-hidden bg-brand py-2 text-nox" role="marquee" aria-label="Infos">
      <div className="ticker-track">
        {row('a')}
        <span aria-hidden className="flex">{row('b')}</span>
      </div>
    </div>
  )
}
