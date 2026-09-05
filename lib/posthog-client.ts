'use client'

import posthog from 'posthog-js'
import { getConsent } from '@/lib/consent'

let initialized = false

/**
 * Initialise PostHog seulement si le consentement est déjà accordé. Volontairement
 * pas de mode "opt_out_capturing_by_default" + init systématique : posthog-js peut
 * déclencher un appel réseau de config (/decide) dès l'init, avant tout opt-in — on
 * ne veut aucune requête vers PostHog tant que "Accepter" n'a pas été cliqué.
 */
export function initPostHogIfConsented() {
  if (initialized || typeof window === 'undefined') return
  if (getConsent() !== 'granted') return

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
    persistence: 'localStorage+cookie',
  })
  initialized = true
}

/** Appelé quand l'utilisateur refuse (ou revient sur son choix) après avoir déjà consenti. */
export function stopPostHogCapturing() {
  if (!initialized) return
  posthog.opt_out_capturing()
}

/** No-op tant que le consentement n'a pas été accordé — jamais de fallback "capture quand même". */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (!initialized || getConsent() !== 'granted') return
  posthog.capture(event, properties)
}

/** distinct_id = user.id (Better Auth) une fois connecté — jamais l'email ou le nom. */
export function identify(userId: string) {
  if (!initialized || getConsent() !== 'granted') return
  posthog.identify(userId)
}

export { posthog }
