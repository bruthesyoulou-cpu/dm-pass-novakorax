import { useSyncExternalStore } from 'react'
import { DEFAULT_CONFIG } from '../data/constants'
import type { AppState, Booking, Config, Status, Submission } from '../types'
import * as remote from './remote'

const KEY = 'dmpass:v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<AppState>
      return {
        config: { ...DEFAULT_CONFIG, ...(p.config ?? {}) },
        submissions: p.submissions ?? [],
        bookings: p.bookings ?? []
      }
    }
  } catch { /* données corrompues : on repart des valeurs par défaut */ }
  return { config: DEFAULT_CONFIG, submissions: [], bookings: [] }
}

let state: AppState = load()
const listeners = new Set<() => void>()

function commit(next: AppState, persist = true) {
  state = next
  if (persist) {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* quota */ }
  }
  listeners.forEach((l) => l())
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb) } },
    () => state
  )
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export function updateConfig(patch: Partial<Config>) {
  const config = { ...state.config, ...patch }
  commit({ ...state, config })
  void remote.saveConfig(config)
}

export function addSubmission(s: Submission) {
  commit({ ...state, submissions: [s, ...state.submissions] })
  void remote.saveItem('submissions', s)
}

export function addBooking(b: Booking) {
  commit({ ...state, bookings: [b, ...state.bookings] })
  void remote.saveItem('bookings', b)
}

export function setStatus(kind: 'submissions' | 'bookings', id: string, status: Status) {
  if (kind === 'submissions') {
    const submissions = state.submissions.map((x) => (x.id === id ? { ...x, status } : x))
    commit({ ...state, submissions })
    const item = submissions.find((x) => x.id === id)
    if (item) void remote.saveItem('submissions', item)
  } else {
    const bookings = state.bookings.map((x) => (x.id === id ? { ...x, status } : x))
    commit({ ...state, bookings })
    const item = bookings.find((x) => x.id === id)
    if (item) void remote.saveItem('bookings', item)
  }
}

export function removeItem(kind: 'submissions' | 'bookings', id: string) {
  if (kind === 'submissions') commit({ ...state, submissions: state.submissions.filter((x) => x.id !== id) })
  else commit({ ...state, bookings: state.bookings.filter((x) => x.id !== id) })
  void remote.deleteItem(kind, id)
}

// Synchronisation temps réel (si Firebase est configuré)
if (remote.enabled) {
  remote.subscribe({
    onConfig: (c) => commit({ ...state, config: { ...DEFAULT_CONFIG, ...c } }),
    onSubmissions: (list) => commit({ ...state, submissions: list as Submission[] }),
    onBookings: (list) => commit({ ...state, bookings: list as Booking[] })
  })
}

// Mise à jour entre onglets du même appareil
window.addEventListener('storage', (e) => {
  if (e.key === KEY) commit(load(), false)
})
