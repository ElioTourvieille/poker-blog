import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedPosts, getCategories, getPosts } from '@/lib/sanity/fetch'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: t('heroTitle') }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')

  const [featured, categoriesData, { posts: latest }] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getPosts(1),
  ])

  const typedLocale = locale as Locale

  return (
    <main className="flex flex-col flex-1">
      {/* Hero */}
      <section className="bg-zinc-900 dark:bg-zinc-950 text-white px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">{t('heroSubtitle')}</p>
          <Link
            href="/blog"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-white text-zinc-900 px-6 py-3 font-semibold hover:bg-zinc-100 transition-colors"
          >
            {tCommon('viewAll')} →
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categoriesData.length > 0 && (
        <section className="px-4 py-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {categoriesData.map((cat) => (
              <CategoryBadge
                key={cat._id}
                title={getLocalizedValue(cat.title, typedLocale) ?? ''}
                slug={cat.slug?.current ?? ''}
                color={cat.color}
                locale={typedLocale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured posts */}
      {featured.length > 0 && (
        <section className="px-4 py-10 max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">{t('featuredTitle')}</h2>
          <ArticleGrid
            posts={featured}
            locale={typedLocale}
            tReadMore={tCommon('readMore')}
            tBy={tCommon('by')}
            tMinRead={tCommon('minRead')}
          />
        </section>
      )}

      {/* Latest posts */}
      {latest.length > 0 && (
        <section className="px-4 py-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('latestTitle')}</h2>
            <Link href="/blog" className="text-sm font-medium hover:underline">
              {tCommon('viewAll')} →
            </Link>
          </div>
          <ArticleGrid
            posts={latest}
            locale={typedLocale}
            tReadMore={tCommon('readMore')}
            tBy={tCommon('by')}
            tMinRead={tCommon('minRead')}
          />
        </section>
      )}
    </main>
  )
}
