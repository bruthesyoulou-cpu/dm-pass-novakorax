import { useMemo, useState } from 'react'
import { Mail, MessageCircle, Send } from 'lucide-react'
import { useApp, type Key } from '../i18n'
import { addSubmission, uid, useAppState } from '../lib/store'
import { CATEGORY_FIELDS, MUSIC_STYLES, OTHER, PRICE_ALBUM, PRICE_SINGLE } from '../data/constants'
import { categoryLabel, registerMessage } from '../lib/messages'
import { dispatch, type Channel, type SendResult } from '../lib/send'
import { fcfa } from '../lib/format'
import type { Category, Format } from '../types'
import SendDialog from './SendDialog'

const CATS: Category[] = ['independent', 'label', 'producer', 'beatmaker']

export default function Register() {
  const { t } = useApp()
  const { config } = useAppState()
  const [format, setFormat] = useState<Format>('single')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('independent')
  const [style, setStyle] = useState('')
  const [styleOther, setStyleOther] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [attest, setAttest] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState<SendResult | null>(null)

  const price = format === 'single' ? PRICE_SINGLE : PRICE_ALBUM
  const defs = CATEGORY_FIELDS[category]
  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }))
  const finalStyle = style === OTHER ? styleOther.trim() : style

  const missing = useMemo(() => {
    const m: string[] = []
    if (!title.trim()) m.push(t('fTitle'))
    if (!style) m.push(t('fStyle'))
    else if (style === OTHER && !styleOther.trim()) m.push(t('fStyleOther'))
    for (const f of defs) if (f.required && !(values[f.key] ?? '').trim()) m.push(t(f.key as Key))
    return m
  }, [title, style, styleOther, defs, values, t])

  const send = (channel: Channel) => {
    if (missing.length) { setError(`${t('errRequired')} ${missing.join(', ')}.`); return }
    if (!attest) { setError(t('errAttest')); return }
    setError('')
    const message = registerMessage(t, { format, price, title: title.trim(), category, style: finalStyle, fields: values })
    const base = channel === 'whatsapp' ? config.waNovakorax : channel === 'telegram' ? config.telegramNovakorax : config.emailNovakorax
    const result = dispatch(channel, base, message, `${t('msgSubject')} - ${title.trim()}`)
    addSubmission({
      id: uid(), createdAt: Date.now(), status: 'new', format, title: title.trim(), category,
      style: finalStyle, fields: values, channel, message
    })
    setSent(result)
  }

  const Req = ({ r }: { r: boolean }) => (r ? <span className="text-alert"> *</span> : null)

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t('regTitle')}</h1>
      <p className="mt-3 max-w-xl text-muted">{t('regIntro')}</p>

      <div className="card mt-8 space-y-6 p-5 sm:p-8">
        <fieldset>
          <legend className="mb-2 font-semibold">{t('fFormat')} <span className="text-alert">*</span></legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['single', 'album'] as Format[]).map((f) => (
              <label key={f} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 ${format === f ? 'border-brand bg-brand/10' : 'border-line'}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="format" checked={format === f} onChange={() => setFormat(f)} className="h-5 w-5 accent-[#FFB800]" />
                  <span className="font-semibold">{t(f)}</span>
                </span>
                <span className="font-display text-lg font-bold">{fcfa(f === 'single' ? PRICE_SINGLE : PRICE_ALBUM)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="mb-1.5 block font-semibold" htmlFor="title">{t('fTitle')}<Req r /></label>
          <input id="title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="mb-1.5 block font-semibold" htmlFor="cat">{t('fCategory')}<Req r /></label>
          <select id="cat" className="field" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATS.map((c) => <option key={c} value={c}>{categoryLabel(t, c)}</option>)}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {defs.map((f) => (
            <div key={category + f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block font-medium" htmlFor={f.key}>{t(f.key as Key)}<Req r={f.required} /></label>
              {f.type === 'textarea'
                ? <textarea id={f.key} rows={3} className="field" value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                : <input id={f.key} type={f.type ?? 'text'} inputMode={f.type === 'number' ? 'numeric' : undefined} min={f.type === 'number' ? 0 : undefined}
                    className="field" value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-semibold" htmlFor="style">{t('fStyle')}<Req r /></label>
            <select id="style" className="field" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="">{t('selectPlaceholder')}</option>
              {MUSIC_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value={OTHER}>{t('other')}</option>
            </select>
          </div>
          {style === OTHER && (
            <div>
              <label className="mb-1.5 block font-semibold" htmlFor="styleOther">{t('fStyleOther')}<Req r /></label>
              <input id="styleOther" className="field" value={styleOther} onChange={(e) => setStyleOther(e.target.value)} />
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
          <input type="checkbox" checked={attest} onChange={(e) => setAttest(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#FFB800]" />
          <span>{t('attestRegister')} <span className="text-alert">*</span></span>
        </label>

        {error && <p role="alert" className="rounded-lg border border-alert bg-alert/10 p-3 font-medium">{error}</p>}

        <div>
          <p className="mb-2 flex items-center gap-2 font-semibold"><Send size={18} />{t('sendVia')}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <button className="btn btn-primary" onClick={() => send('whatsapp')}><MessageCircle size={18} />WhatsApp</button>
            <button className="btn btn-ghost" onClick={() => send('telegram')}><Send size={18} />Telegram</button>
            <button className="btn btn-ghost" onClick={() => send('email')}><Mail size={18} />Email</button>
          </div>
        </div>
      </div>

      {sent && <SendDialog result={sent} onClose={() => setSent(null)} />}
    </div>
  )
}
