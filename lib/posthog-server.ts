import { PostHog } from 'posthog-node'

let client: PostHog | null = null

function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      // Environnement serverless (Vercel) : la fonction peut se terminer avant
      // qu'un batch parte. On envoie chaque event immédiatement plutôt que de
      // risquer de le perdre.
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}

/**
 * Capture un événement depuis le serveur (Route Handler, hook Better Auth).
 * L'appelant est responsable de vérifier le consentement avant d'appeler cette
 * fonction (voir lib/consent.ts, parseConsentCookie) — pas de garde ici, pour
 * rester explicite au point d'appel plutôt que caché dans un helper partagé.
 */
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const posthog = getClient()
  if (!posthog) return
  posthog.capture({ distinctId, event, properties })
}
