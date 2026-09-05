/**
 * Consentement cookies — source de vérité unique, lisible côté client (bandeau,
 * init PostHog) et côté serveur (routes API, hooks Better Auth) via le même
 * cookie, pour que les événements serveur respectent le même choix que le
 * client sans dépendre d'un second mécanisme.
 *
 * Voir prompts/01-analytics-posthog.md.
 */

export const CONSENT_COOKIE = 'plo-cookie-consent'
export type ConsentStatus = 'granted' | 'denied' | 'undecided'

const CONSENT_EVENT = 'plo:consent-changed'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180 // ~6 mois

/** Isomorphe : parse un header `Cookie` brut (serveur) ou `document.cookie` (client). */
export function parseConsentCookie(cookieHeader: string | null | undefined): ConsentStatus {
  if (!cookieHeader) return 'undecided'
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)`),
  )
  return match?.[1] === 'granted' || match?.[1] === 'denied' ? match[1] : 'undecided'
}

/** Client uniquement — lit le choix courant depuis document.cookie. */
export function getConsent(): ConsentStatus {
  if (typeof document === 'undefined') return 'undecided'
  return parseConsentCookie(document.cookie)
}

/** Client uniquement — enregistre le choix et prévient les composants montés (bandeau, provider PostHog). */
export function setConsent(status: 'granted' | 'denied') {
  if (typeof document === 'undefined') return
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${status}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent<ConsentStatus>(CONSENT_EVENT, { detail: status }))
}

/** Client uniquement — efface le choix (rouvre le bandeau via "Gérer les cookies"). */
export function resetConsent() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`
  window.dispatchEvent(new CustomEvent<ConsentStatus>(CONSENT_EVENT, { detail: 'undecided' }))
}

export function onConsentChange(callback: (status: ConsentStatus) => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => callback((e as CustomEvent<ConsentStatus>).detail)
  window.addEventListener(CONSENT_EVENT, handler)
  return () => window.removeEventListener(CONSENT_EVENT, handler)
}
