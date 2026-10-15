import { eventConfig } from '../config/event'

/** URL actual de la invitación, sin hash ni parámetros de seguimiento. */
export function invitationUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}`
}

export function whatsappShareUrl(): string {
  const text = `${eventConfig.shareMessage}\n${invitationUrl()}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
