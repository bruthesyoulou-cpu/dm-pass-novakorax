import { createContext, useContext } from 'react'
import fr, { type Dict } from './fr'
import en from './en'
import ln from './ln'
import type { Lang, Theme } from '../types'

export type Key = keyof Dict
export const dictionaries: Record<Lang, Dict> = { fr, en, ln }

export interface Ctx {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  t: (k: Key) => string
}
export const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)
