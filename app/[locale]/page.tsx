import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedPosts, getPosts } from '@/lib/sanity/fetch'
import { FeaturedArticle } from '@/components/blog/FeaturedArticle'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')

  const [featured, { posts: latest }] = await Promise.all([
    getFeaturedPosts(),
    getPosts(1),
  ])

  const typedLocale = locale as Locale
  const heroPost = featured[0] ?? latest[0]
  const featurePost = featured[1] ?? latest[1]
  const gridPosts = latest.slice(0, 3)

  const heroImage = heroPost?.mainImage?.asset
    ? `url(https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${heroPost.mainImage.asset._ref?.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}?w=1600&auto=format)`
    : null

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-inverse-surface" style={{ minHeight: 420 }}>
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: heroImage }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-16 py-20 md:py-28 flex flex-col justify-end h-full min-h-105">
          <p className="font-ui text-xs tracking-[0.15em] uppercase text-secondary mb-4">
            {t('heroLabel')}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-inverse-on-surface leading-tight tracking-tight max-w-2xl mb-4">
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-base md:text-lg text-outline max-w-xl leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Feature article ───────────────────────────────────────── */}
      {featurePost && (
        <section className="max-w-7xl mx-auto px-4 md:px-16 py-16 md:py-24">
          <FeaturedArticle
            post={featurePost}
            locale={typedLocale}
            label={t('featuredLabel')}
            tMinRead={tCommon('minRead')}
          />
        </section>
      )}

      {/* ── Latest dispatches ─────────────────────────────────────── */}
      {gridPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-16 pb-20 md:pb-32">
          <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-outline-variant">
            <h2 className="font-serif text-2xl font-semibold text-on-surface">
              {t('latestTitle')}
            </h2>
            <Link
              href="/blog"
              className="font-ui text-xs tracking-widest uppercase text-secondary hover:text-secondary/70 transition-colors"
            >
              {tCommon('viewAll')} →
            </Link>
          </div>
          <ArticleGrid posts={gridPosts} locale={typedLocale} tMinRead={tCommon('minRead')} />
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-16 md:py-20 flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          <div className="flex-1">
            <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-3">
              Newsletter
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-on-surface leading-tight mb-3">
              Analyses & stratégies directement dans votre boîte
            </h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Résumé hebdomadaire des nouveaux articles, notifications Main de la semaine. Aucun spam.
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <NewsletterForm compact />
          </div>
        </div>
      </section>
    </main>
  )
}
