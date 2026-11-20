import { useState } from 'react'
import { Lock, LogOut, Trash2 } from 'lucide-react'
import { useApp, type Key } from '../i18n'
import { removeItem, setStatus, updateConfig, useAppState } from '../lib/store'
import { enabled as syncEnabled } from '../lib/remote'
import { categoryLabel } from '../lib/messages'
import { fcfa, formatDate } from '../lib/format'
import type { Config, Status } from '../types'

export type Role = 'general' | 'studio'

export function PinModal({ onSuccess, onClose }: { onSuccess: (r: Role) => void; onClose: () => void }) {
  const { t } = useApp()
  const { config } = useAppState()
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const check = () => {
    if (pin && pin === config.pinGeneral) onSuccess('general')
    else if (pin && pin === config.pinStudio) onSuccess('studio')
    else setErr(true)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="card w-full max-w-sm p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Lock size={20} className="text-brand" />{t('adminPin')}</h2>
        <input autoFocus type="password" inputMode="numeric" autoComplete="off" className="field mt-4 text-center text-2xl tracking-widest"
          value={pin} onChange={(e) => { setPin(e.target.value); setErr(false) }} onKeyDown={(e) => e.key === 'Enter' && check()} aria-label={t('adminPin')} />
        {err && <p role="alert" className="mt-2 text-sm font-medium text-alert">{t('adminWrong')}</p>}
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary flex-1" onClick={check}>{t('adminUnlock')}</button>
          <button className="btn btn-ghost" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  )
}

const STATUSES: { v: Status; k: Key }[] = [{ v: 'new', k: 'stNew' }, { v: 'confirmed', k: 'stConfirmed' }, { v: 'done', k: 'stDone' }]

function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  const { t } = useApp()
  return (
    <select className="field !min-h-[40px] !w-auto !py-1.5" value={value} onChange={(e) => onChange(e.target.value as Status)}>
      {STATUSES.map((s) => <option key={s.v} value={s.v}>{t(s.k)}</option>)}
    </select>
  )
}

export default function Admin({ role, onExit }: { role: Role; onExit: () => void }) {
  const { t, lang } = useApp()
  const { config, submissions, bookings } = useAppState()
  const [tab, setTab] = useState<'links' | 'kyc' | 'bookings'>(role === 'general' ? 'links' : 'bookings')
  const [draft, setDraft] = useState<Config>(config)
  const [saved, setSaved] = useState(false)
  const confirmDel = (kind: 'submissions' | 'bookings', id: string) => { if (window.confirm(t('delConfirm'))) removeItem(kind, id) }

  const linkFields: { k: keyof Config; label: Key; type?: string }[] = [
    { k: 'waNovakorax', label: 'lWaNova' }, { k: 'telegramNovakorax', label: 'lTgNova' }, { k: 'emailNovakorax', label: 'lMailNova' },
    { k: 'waStudio', label: 'lWaStudio' }, { k: 'tiktok', label: 'lTiktok' }, { k: 'v1Url', label: 'lV1' },
    { k: 'pinGeneral', label: 'lPinGeneral' }, { k: 'pinStudio', label: 'lPinStudio' }
  ]

  const save = () => {
    const clean = { ...draft, pinGeneral: draft.pinGeneral.trim() || config.pinGeneral, pinStudio: draft.pinStudio.trim() || config.pinStudio }
    updateConfig(clean)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = role === 'general'
    ? [{ id: 'links' as const, k: 'tabLinks' as Key }, { id: 'kyc' as const, k: 'tabKyc' as Key }, { id: 'bookings' as const, k: 'tabBookings' as Key }]
    : [{ id: 'bookings' as const, k: 'tabBookings' as Key }]

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">{role === 'general' ? t('adminGeneral') : t('adminStudio')}</h1>
          <button className="btn btn-ghost" onClick={onExit}><LogOut size={18} />{t('adminLogout')}</button>
        </div>
        <p className="mt-1 text-sm text-muted">{syncEnabled ? t('syncOn') : t('syncOff')}</p>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist">
          {tabs.map((x) => (
            <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}
              className={`rounded-lg px-4 py-2 font-medium ${tab === x.id ? 'bg-brand text-nox' : 'border border-line'}`}>
              {t(x.k)}{x.id === 'kyc' ? ` (${submissions.length})` : x.id === 'bookings' ? ` (${bookings.length})` : ''}
            </button>
          ))}
        </div>

        {tab === 'links' && role === 'general' && (
          <div className="card mt-5 space-y-4 p-5">
            {linkFields.map((f) => (
              <div key={f.k}>
                <label className="mb-1 block font-medium" htmlFor={f.k}>{t(f.label)}</label>
                <input id={f.k} className="field" value={draft[f.k]} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={save}>{saved ? t('saved') : t('saveSettings')}</button>
          </div>
        )}

        {tab === 'kyc' && role === 'general' && (
          <div className="mt-5 space-y-4">
            {submissions.length === 0 && <p className="text-muted">{t('empty')}</p>}
            {submissions.map((s) => (
              <article key={s.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="text-sm text-muted">
                      {categoryLabel(t, s.category)} · {s.style} · {s.format === 'single' ? t('single') : t('album')} · {new Date(s.createdAt).toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR')} · {s.channel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusSelect value={s.status} onChange={(v) => setStatus('submissions', s.id, v)} />
                    <button className="btn btn-ghost !min-h-[40px] !px-3 text-alert" onClick={() => confirmDel('submissions', s.id)} aria-label={t('del')}><Trash2 size={18} /></button>
                  </div>
                </div>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-bg p-3 font-sans text-sm">{s.message}</pre>
              </article>
            ))}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="mt-5 space-y-4">
            {bookings.length === 0 && <p className="text-muted">{t('empty')}</p>}
            {bookings.map((b) => (
              <article key={b.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{b.artist} · {b.project}</h3>
                    <p className="text-sm text-muted">{b.style} · {fcfa(b.price)} · {formatDate(b.date, lang)} · {b.slot}</p>
                    <p className="text-sm text-muted">{b.whatsapp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusSelect value={b.status} onChange={(v) => setStatus('bookings', b.id, v)} />
                    <button className="btn btn-ghost !min-h-[40px] !px-3 text-alert" onClick={() => confirmDel('bookings', b.id)} aria-label={t('del')}><Trash2 size={18} /></button>
                  </div>
                </div>
                {b.notes && <p className="mt-2 text-sm">{b.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
