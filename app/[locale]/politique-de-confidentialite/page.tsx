import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPageBySlug } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { PortableTextRenderer } from '@/components/blog/PortableTextRenderer'
import type { Locale } from '@/i18n/routing'
import type { BlockContent } from '@/sanity.types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' })
  return { title: t('title') }
}

// Contenu porté par Sanity (document `page`, slug "politique-de-confidentialite")
// pour rester éditable sans déploiement — volontairement pas de texte légal en
// dur dans le code. Tant que le document n'existe pas dans Sanity (zéro contenu
// publié à ce jour, voir AGENTS.md), la page affiche l'avertissement ci-dessous
// plutôt qu'un texte inventé. Voir prompts/01-analytics-posthog.md, hypothèse 3.
export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('privacyPolicy')
  const typedLocale = locale as Locale

  const page = await getPageBySlug('politique-de-confidentialite')
  const title = page ? (getLocalizedValue(page.title, typedLocale) ?? t('title')) : t('title')
  const body = page ? getLocalizedValue(page.body as { fr?: BlockContent; en?: BlockContent } | null, typedLocale) : null

  return (
    <main className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
      <h1 className="text-display text-4xl md:text-5xl text-plo-white mb-10">{title}</h1>
      {body ? (
        <PortableTextRenderer value={body} />
      ) : (
        <p className="font-sans text-plo-gray">{t('pendingNotice')}</p>
      )}
    </main>
  )
}
