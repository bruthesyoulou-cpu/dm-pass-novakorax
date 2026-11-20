import { useRef, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Logo from './Logo'
import { useApp, type Key } from '../i18n'
import type { Lang, Page } from '../types'

const ITEMS: { id: Page; key: Key }[] = [
  { id: 'home', key: 'navHome' }, { id: 'register', key: 'navRegister' }, { id: 'studio', key: 'navStudio' },
  { id: 'pricing', key: 'navPricing' }, { id: 'events', key: 'navEvents' }
]

export default function Navbar({ page, go, onSecret }: { page: Page; go: (p: Page) => void; onSecret: () => void }) {
  const { t, lang, setLang, theme, setTheme } = useApp()
  const [open, setOpen] = useState(false)
  const clicks = useRef<number[]>([])

  // 5 clics rapides (moins de 3 s) sur le logo : ouvre la fenêtre PIN (aucun indice visible)
  const logoClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter((c) => now - c < 3000), now]
    if (clicks.current.length >= 5) { clicks.current = []; onSecret() }
    else go('home')
  }

  const nav = (p: Page) => { go(p); setOpen(false) }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <button onClick={logoClick} className="flex items-center gap-2.5" aria-label="DM PASS">
          <Logo size={38} />
          <span className="font-display text-xl font-extrabold">DM PASS</span>
        </button>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {ITEMS.map((i) => (
            <button key={i.id} onClick={() => nav(i.id)}
              className={`rounded-lg px-3 py-2 text-[0.95rem] font-medium ${page === i.id ? 'bg-brand text-nox' : 'hover:bg-card'}`}
              aria-current={page === i.id ? 'page' : undefined}>
              {t(i.key)}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <select aria-label={t('language')} value={lang} onChange={(e) => setLang(e.target.value as Lang)}
            className="field !min-h-[40px] !w-auto !py-1.5">
            <option value="fr">FR</option><option value="en">EN</option><option value="ln">LN</option>
          </select>
          <button className="btn btn-ghost !min-h-[40px] !px-3" onClick={() => setTheme(theme === 'night' ? 'cream' : 'night')}
            aria-label={`${t('theme')} : ${theme === 'night' ? t('themeCream') : t('themeNight')}`}>
            {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn btn-ghost !min-h-[40px] !px-3 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-bg px-4 py-2 lg:hidden" aria-label="Navigation mobile">
          {ITEMS.map((i) => (
            <button key={i.id} onClick={() => nav(i.id)}
              className={`my-1 block w-full rounded-lg px-3 py-3 text-left font-medium ${page === i.id ? 'bg-brand text-nox' : 'hover:bg-card'}`}>
              {t(i.key)}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
