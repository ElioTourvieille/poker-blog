'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { capture } from '@/lib/posthog-client'

/**
 * Îlot client sans rendu — envoie un $pageview à chaque changement de route.
 * Lit l'URL complète via window.location plutôt que useSearchParams() pour
 * éviter d'exiger une frontière <Suspense> autour de tout le layout.
 * No-op tant que le consentement n'est pas accordé (voir lib/posthog-client.ts).
 */
export function PageviewTracker() {
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    capture('$pageview', {
      locale,
      $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }, [pathname, locale])

  return null
}
