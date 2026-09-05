'use client'

import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getConsent, setConsent, onConsentChange } from '@/lib/consent'

// document.cookie n'existe pas côté serveur — useSyncExternalStore gère le
// mismatch SSR/client proprement (rendu masqué au premier rendu serveur, resync
// synchrone juste après hydration) plutôt qu'un useState+useEffect qui déclenche
// un second rendu.
function subscribe(callback: () => void) {
  return onConsentChange(() => callback())
}
function getSnapshot() {
  return getConsent() === 'undecided'
}
function getServerSnapshot() {
  return false
}

/**
 * Vrai bandeau de consentement (décision validée le 05/09/2026, voir
 * prompts/01-analytics-posthog.md) — binaire Accepter/Refuser, une seule
 * catégorie ("mesure d'audience"). Rien n'est envoyé à PostHog tant que
 * "Accepter" n'a pas été cliqué.
 */
export function ConsentBanner() {
  const t = useTranslations('cookieBanner')
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-plo-border bg-plo-black"
    >
      <div className="max-w-site mx-auto px-4 md:px-16 py-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <p className="font-ui text-xs tracking-widest uppercase text-plo-red mb-1">
            {t('title')}
          </p>
          <p className="font-sans text-sm text-plo-gray">
            {t('description')}{' '}
            <Link
              href="/politique-de-confidentialite"
              className="underline hover:text-plo-white transition-colors"
            >
              {t('learnMore')}
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => setConsent('denied')} className="btn-secondary">
            {t('reject')}
          </button>
          <button type="button" onClick={() => setConsent('granted')} className="btn-primary">
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
