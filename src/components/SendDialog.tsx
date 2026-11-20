import { Check, Copy, ExternalLink } from 'lucide-react'
import { useApp } from '../i18n'
import type { SendResult } from '../lib/send'

export default function SendDialog({ result, onClose }: { result: SendResult; onClose: () => void }) {
  const { t } = useApp()
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-auto p-5">
        <h3 className="flex items-center gap-2 text-xl font-bold"><Check className="text-brand" />{t('sentTitle')}</h3>
        {result.channel !== 'email' && (
          <p className="mt-2 flex items-start gap-2 text-sm text-muted"><Copy size={16} className="mt-0.5 shrink-0" />
            <span><strong className="text-ink">{t('copied')}.</strong> {t('copiedHint')}</span></p>
        )}
        <p className="mt-4 text-sm font-semibold">{t('preview')}</p>
        <pre className="mt-1 whitespace-pre-wrap rounded-lg border border-line bg-bg p-3 font-sans text-sm">{result.message}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="btn btn-primary" href={result.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} />{t('openChannel')}</a>
          <button className="btn btn-ghost" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  )
}
