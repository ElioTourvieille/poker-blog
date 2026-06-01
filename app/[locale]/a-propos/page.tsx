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
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const typedLocale = locale as Locale

  const page = await getPageBySlug('a-propos')
  const title = page ? (getLocalizedValue(page.title, typedLocale) ?? t('title')) : t('title')
  const body = page ? getLocalizedValue(page.body as { fr?: BlockContent; en?: BlockContent } | null, typedLocale) : null

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">{title}</h1>
      {body ? (
        <PortableTextRenderer value={body} />
      ) : (
        <p className="text-zinc-500">Contenu à venir.</p>
      )}
    </main>
  )
}
