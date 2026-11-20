import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppCtx, dictionaries, type Key } from './i18n'
import type { Lang, Page, Theme } from './types'
import Navbar from './components/Navbar'
import Ticker from './components/Ticker'
import Footer from './components/Footer'
import Home from './components/Home'
import Register from './components/Register'
import Studio from './components/Studio'
import Pricing from './components/Pricing'
import Events from './components/Events'
import Admin, { PinModal, type Role } from './components/Admin'

const read = <T extends string>(k: string, fallback: T, ok: readonly T[]): T => {
  try { const v = localStorage.getItem(k) as T | null; if (v && ok.includes(v)) return v } catch { /* ignoré */ }
  return fallback
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => read('dmpass:lang', 'fr', ['fr', 'en', 'ln']))
  const [theme, setThemeState] = useState<Theme>(() => read('dmpass:theme', 'night', ['night', 'cream']))
  const [page, setPage] = useState<Page>('home')
  const [pinOpen, setPinOpen] = useState(() => new URLSearchParams(window.location.search).get('panel') === 'admin')
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang === 'ln' ? 'ln' : lang
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'night' ? '#0B1B33' : '#F8F6F1')
  }, [theme, lang])

  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem('dmpass:lang', l) } catch { /* ignoré */ } }
  const setTheme = (th: Theme) => { setThemeState(th); try { localStorage.setItem('dmpass:theme', th) } catch { /* ignoré */ } }

  const go = useCallback((p: Page) => { setPage(p); window.scrollTo({ top: 0 }) }, [])
  const t = useCallback((k: Key) => dictionaries[lang][k] ?? dictionaries.fr[k], [lang])
  const ctx = useMemo(() => ({ lang, setLang, theme, setTheme, t }), [lang, theme, t])

  const exitAdmin = () => {
    setRole(null)
    if (window.location.search) window.history.replaceState({}, '', window.location.pathname)
  }

  return (
    <AppCtx.Provider value={ctx}>
      <div className="flex min-h-screen flex-col">
        <Navbar page={page} go={go} onSecret={() => setPinOpen(true)} />
        <Ticker />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8">
          {page === 'home' && <Home go={go} />}
          {page === 'register' && <Register />}
          {page === 'studio' && <Studio />}
          {page === 'pricing' && <Pricing />}
          {page === 'events' && <Events />}
        </main>
        <Footer />
      </div>
      {pinOpen && !role && <PinModal onClose={() => { setPinOpen(false); exitAdmin() }} onSuccess={(r) => { setRole(r); setPinOpen(false) }} />}
      {role && <Admin role={role} onExit={exitAdmin} />}
    </AppCtx.Provider>
  )
}
