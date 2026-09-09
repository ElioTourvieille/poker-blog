'use client'

import { useEffect } from 'react'
import { initPostHogIfConsented, stopPostHogCapturing } from '@/lib/posthog-client'
import { onConsentChange } from '@/lib/consent'

/**
 * Îlot client sans rendu — écoute le consentement et (dés)initialise PostHog en
 * conséquence. Monté une fois dans app/[locale]/layout.tsx, à côté du
 * ConsentBanner et du PageviewTracker.
 */
export function PostHogProvider() {
  useEffect(() => {
    initPostHogIfConsented()

    return onConsentChange((status) => {
      if (status === 'granted') initPostHogIfConsented()
      if (status === 'denied') stopPostHogCapturing()
    })
  }, [])

  return null
}
