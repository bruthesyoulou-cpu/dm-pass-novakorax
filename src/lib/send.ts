export type Channel = 'whatsapp' | 'telegram' | 'email'

export interface SendResult { url: string; message: string; channel: Channel }

// Les liens wa.me/c/… (catalogue) et wa.me/message/… ne savent pas pré-remplir un texte :
// on copie donc toujours le message dans le presse-papiers avant d'ouvrir le canal.
export function buildUrl(channel: Channel, base: string, message: string, subject: string): string {
  if (channel === 'email') {
    return `mailto:${base}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  }
  if (channel === 'whatsapp' && /wa\.me\/\d+/.test(base)) {
    return `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`
  }
  return base
}

// À appeler directement dans un gestionnaire de clic (sinon le navigateur bloque l'ouverture).
export function dispatch(channel: Channel, base: string, message: string, subject: string): SendResult {
  const url = buildUrl(channel, base, message, subject)
  if (channel !== 'email') {
    try { void navigator.clipboard.writeText(message).catch(() => undefined) } catch { /* ignoré */ }
  }
  if (channel === 'email') window.location.href = url
  else window.open(url, '_blank', 'noopener,noreferrer')
  return { url, message, channel }
}
