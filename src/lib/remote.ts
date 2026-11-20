// Couche Firebase OPTIONNELLE. Sans variables VITE_FIREBASE_*, tout reste en LocalStorage.
import type { Config } from '../types'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined
}

export const enabled = Boolean(cfg.apiKey && cfg.projectId)

type Fs = typeof import('firebase/firestore')
let cache: Promise<{ fs: Fs; db: ReturnType<Fs['getFirestore']> }> | null = null

function db() {
  if (!cache) {
    cache = (async () => {
      const { initializeApp } = await import('firebase/app')
      const fs = await import('firebase/firestore')
      const app = initializeApp(cfg as Record<string, string>)
      return { fs, db: fs.getFirestore(app) }
    })()
  }
  return cache
}

export async function saveConfig(config: Config) {
  if (!enabled) return
  try {
    const { fs, db: d } = await db()
    await fs.setDoc(fs.doc(d, 'dmpass', 'config'), config)
  } catch (e) { console.warn('Firebase saveConfig', e) }
}

export async function saveItem(col: 'submissions' | 'bookings', item: { id: string }) {
  if (!enabled) return
  try {
    const { fs, db: d } = await db()
    await fs.setDoc(fs.doc(d, col, item.id), item)
  } catch (e) { console.warn('Firebase saveItem', e) }
}

export async function deleteItem(col: 'submissions' | 'bookings', id: string) {
  if (!enabled) return
  try {
    const { fs, db: d } = await db()
    await fs.deleteDoc(fs.doc(d, col, id))
  } catch (e) { console.warn('Firebase deleteItem', e) }
}

export function subscribe(h: {
  onConfig: (c: Config) => void
  onSubmissions: (l: unknown[]) => void
  onBookings: (l: unknown[]) => void
}) {
  void (async () => {
    try {
      const { fs, db: d } = await db()
      fs.onSnapshot(fs.doc(d, 'dmpass', 'config'), (s) => { if (s.exists()) h.onConfig(s.data() as Config) })
      const sorted = (col: string) => fs.query(fs.collection(d, col), fs.orderBy('createdAt', 'desc'))
      fs.onSnapshot(sorted('submissions'), (s) => h.onSubmissions(s.docs.map((x) => x.data())))
      fs.onSnapshot(sorted('bookings'), (s) => h.onBookings(s.docs.map((x) => x.data())))
    } catch (e) { console.warn('Firebase subscribe', e) }
  })()
}
