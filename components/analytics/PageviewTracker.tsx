'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { capture } from '@/lib/posthog-client'
import { onConsentChange } from '@/lib/consent'

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
    const sendPageview = () => {
      capture('$pageview', {
        locale,
        $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
      })
    }

    // No-op tant que le consentement n'est pas accordé (voir capture()). Si le
    // visiteur accepte via le bandeau APRÈS ce mount, ni pathname ni locale ne
    // changent donc cet effet ne se relance pas — sans ce listener, le pageview
    // de la toute première page vue serait perdu.
    sendPageview()
    return onConsentChange((status) => {
      if (status === 'granted') sendPageview()
    })
  }, [pathname, locale])

  return null
}
