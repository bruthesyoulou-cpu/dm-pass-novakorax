import { useApp } from '../i18n'
import Logo from './Logo'

export default function Footer() {
  const { t } = useApp()
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
        <span className="flex items-center gap-2"><Logo size={22} />{t('footerBuilt')}</span>
        <span>{t('footerRights')}</span>
      </div>
    </footer>
  )
}
