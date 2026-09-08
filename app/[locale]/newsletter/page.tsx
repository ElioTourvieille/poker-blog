import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'newsletter' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { locale } = await params
  const query = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('newsletter')
  const confirmed = query.confirmed === 'true'
  const unsubscribed = query.unsubscribed === 'true'
  const error = query.error as string | undefined

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <p className="text-label text-plo-red mb-4">{t('eyebrow')}</p>

      {/* ── Feedback states ──────────────────────────────────────── */}
      {confirmed && (
        <div className="mb-10 p-5 bg-plo-deep border border-plo-border">
          <p className="text-display text-xl text-plo-white mb-2">{t('confirmedTitle')}</p>
          <p className="font-sans text-sm text-plo-gray">{t('confirmedBody')}</p>
        </div>
      )}

      {unsubscribed && (
        <div className="mb-10 p-5 bg-plo-deep border border-plo-border">
          <p className="text-display text-xl text-plo-white mb-2">{t('unsubscribedTitle')}</p>
          <p className="font-sans text-sm text-plo-gray">{t('unsubscribedBody')}</p>
        </div>
      )}

      {error && !confirmed && !unsubscribed && (
        <div className="mb-10 p-5 bg-plo-deep border border-plo-red/40">
          <p className="text-display text-xl text-plo-white mb-2">{t('errorTitle')}</p>
          <p className="font-sans text-sm text-plo-gray">{t('errorBody')}</p>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <h1 className="text-display text-4xl md:text-5xl text-plo-white mb-6">{t('title')}</h1>
      <p className="font-sans text-lg text-plo-gray leading-relaxed mb-10">{t('subtitle')}</p>

      {/* ── Offer cards ──────────────────────────────────────────── */}
      <div className="grid gap-4 mb-10">
        <div className="p-5 border border-plo-border">
          <p className="text-label text-plo-red mb-2">{t('weeklyLabel')}</p>
          <p className="font-sans text-sm text-plo-gray">{t('weeklyBody')}</p>
        </div>
        <div className="p-5 border border-plo-border">
          <p className="text-label text-plo-red mb-2">{t('handLabel')}</p>
          <p className="font-sans text-sm text-plo-gray">{t('handBody')}</p>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────── */}
      <div className="border-t border-plo-border pt-8">
        <p className="text-display text-xl text-plo-white mb-6">{t('chooseSubscriptions')}</p>
        <NewsletterForm defaultLists={['GENERAL', 'HAND_OF_WEEK']} />
      </div>
    </main>
  )
}
