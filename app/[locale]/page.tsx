import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedPosts, getPosts } from '@/lib/sanity/fetch'
import { FeaturedArticle } from '@/components/blog/FeaturedArticle'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const PILLAR_LINKS = [
  { key: 'strategy', href: '/blog?category=strategie' },
  { key: 'obsession', href: '/blog?category=obsession' },
  { key: 'drops', href: '/blog?category=drops' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: `${t('heroTitleLine1')} ${t('heroTitleLine2')} ${t('heroTitleLine3')}`,
    description: t('heroSubtitle'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tNav = await getTranslations('nav')
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
          <h1 className="text-poster text-inverse-on-surface mb-6">
            <span className="block">{t('heroTitleLine1')}</span>
            <span className="block text-plo-red">{t('heroTitleLine2')}</span>
            <span className="block">{t('heroTitleLine3')}</span>
          </h1>
          <p className="font-sans text-xs md:text-sm tracking-[0.08em] uppercase text-outline max-w-xl leading-relaxed mb-8">
            {t('heroSubtitle')}
          </p>
          <Link href="/blog" className="btn-primary self-start">
            {t('heroCta')}
          </Link>
        </div>
      </section>

      {/* ── Dernières publications ───────────────────────────────────
          Fond blanc — voir docs/design-tokens.md, "Rythme de la homepage" */}
      <section className="section-light">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {PILLAR_LINKS.map(({ key, href }) => (
              <Link key={key} href={href} className="text-label text-plo-subtle hover:text-plo-red transition-colors">
                {tNav(key)}
              </Link>
            ))}
          </div>
          <div className="flex items-baseline justify-between mb-10 md:mb-14">
            <h2 className="text-display text-4xl md:text-5xl text-plo-void">{t('latestTitle')}</h2>
            <Link href="/blog" className="text-label text-plo-subtle hover:text-plo-void transition-colors shrink-0">
              {tCommon('viewAll')} →
            </Link>
          </div>

          {featurePost && (
            <div className="mb-10 md:mb-12">
              <FeaturedArticle
                post={featurePost}
                locale={typedLocale}
                label={t('featuredLabel')}
                tReadMore={tCommon('readMore')}
                tMinRead={tCommon('minRead')}
                variant="light"
              />
            </div>
          )}

          {gridPosts.length > 0 && (
            <ArticleGrid
              posts={gridPosts}
              locale={typedLocale}
              tMinRead={tCommon('minRead')}
              tReadMore={tCommon('readMore')}
              variant="light"
            />
          )}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="section-light border-t border-plo-off">
        <div className="max-w-2xl mx-auto px-4 md:px-16 py-16 md:py-24 text-center flex flex-col items-center">
          <p className="text-label text-plo-red mb-4">{t('newsletterEyebrow')}</p>
          <h2 className="text-display text-4xl md:text-5xl text-plo-void mb-4">{t('newsletterTitle')}</h2>
          <p className="font-sans text-sm text-plo-subtle leading-relaxed mb-10 max-w-md">
            {t('newsletterSubtitle')}
          </p>
          <div className="w-full max-w-sm">
            <NewsletterForm compact tone="light" />
          </div>
        </div>
      </section>

      {/* ── Le Cercle ─────────────────────────────────────────────── */}
      <section className="bg-plo-deep">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-16 md:py-24">
          <h2 className="text-display text-3xl md:text-4xl text-plo-white text-center mb-12">
            {t('cercleLabel')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <blockquote className="border border-plo-border p-8 text-center">
              <p className="font-serif text-xl text-plo-white leading-relaxed italic mb-4">
                “{t('cercleQuote1')}”
              </p>
              <cite className="text-label text-plo-gray not-italic">{t('cercleQuote1Author')}</cite>
            </blockquote>
            <blockquote className="border border-plo-border p-8 text-center">
              <p className="font-serif text-xl text-plo-white leading-relaxed italic mb-4">
                “{t('cercleQuote2')}”
              </p>
              <cite className="text-label text-plo-gray not-italic">{t('cercleQuote2Author')}</cite>
            </blockquote>
          </div>
          <div className="flex justify-center">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t('cercleCta')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
