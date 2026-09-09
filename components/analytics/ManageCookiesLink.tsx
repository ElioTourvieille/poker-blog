'use client'

import { useTranslations } from 'next-intl'
import { resetConsent } from '@/lib/consent'

/**
 * Îlot client dans le Footer (Server Component) — rouvre le bandeau de
 * consentement à tout moment en remettant le choix à "undecided".
 */
export function ManageCookiesLink() {
  const t = useTranslations('footer')

  return (
    <button
      type="button"
      onClick={() => resetConsent()}
      className="text-label text-outline hover:text-plo-red transition-colors"
    >
      {t('links.manageCookies')}
    </button>
  )
}
