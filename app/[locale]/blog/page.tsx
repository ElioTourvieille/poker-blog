import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPosts, getPostsByCategory, getCategories } from '@/lib/sanity/fetch'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { FeaturedArticle } from '@/components/blog/FeaturedArticle'
import { Pagination } from '@/components/ui/Pagination'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { page: pageParam, category } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const tCommon = await getTranslations('common')
  const currentPage = Math.max(1, Number(pageParam ?? 1))
  const typedLocale = locale as Locale

  const [categoriesData, postsData] = await Promise.all([
    getCategories(),
    category ? getPostsByCategory(category, currentPage) : getPosts(currentPage),
  ])

  const { posts, pageCount } = postsData
  const buildHref = (p: number) =>
    `/${locale}/blog${category ? `?category=${category}&page=${p}` : `?page=${p}`}`

  const activeCategory = category
    ? categoriesData.find((c) => c.slug?.current === category)
    : null

  const [heroPost, ...restPosts] = posts

  return (
    <main className="section-light">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-plo-off">
        <div className="relative max-w-site mx-auto px-4 md:px-16 pt-16 pb-10 md:pt-24 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <p className="text-label text-plo-subtle mb-2">{t('edition')}</p>
            <h1 className="text-display text-plo-void">
              {activeCategory ? getLocalizedValue(activeCategory.title, typedLocale) ?? t('title') : t('title')}
            </h1>
            <p className="font-sans text-sm text-plo-subtle max-w-md border-l-2 border-plo-red pl-4 mt-4">
              {t('subtitle')}
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-label text-plo-subtle">{t('filterBy')} —</span>
            <nav className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/blog`}
                className={`text-label transition-colors pb-0.5 border-b ${
                  !category ? 'text-plo-red border-plo-red' : 'text-plo-subtle border-transparent hover:text-plo-void'
                }`}
              >
                {t('all')}
              </Link>
              {categoriesData.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/${locale}/blog?category=${cat.slug?.current}`}
                  className={`text-label transition-colors pb-0.5 border-b ${
                    category === cat.slug?.current
                      ? 'text-plo-red border-plo-red'
                      : 'text-plo-subtle border-transparent hover:text-plo-void'
                  }`}
                >
                  {getLocalizedValue(cat.title, typedLocale)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <p aria-hidden="true" className="text-watermark absolute -bottom-6 right-0 text-plo-void opacity-[0.03] select-none hidden md:block">
          {t('title')}
        </p>
      </div>

      {/* ── Articles ──────────────────────────────────────────────── */}
      <div className="max-w-site mx-auto px-4 md:px-16 py-16 md:py-20">
        {posts.length > 0 ? (
          <>
            <div className="mb-10 md:mb-14">
              <FeaturedArticle
                post={heroPost}
                locale={typedLocale}
                label={t('title')}
                tReadMore={tCommon('readMore')}
                tMinRead={tCommon('minRead')}
                variant="light"
              />
            </div>
            {restPosts.length > 0 && (
              <ArticleGrid
                posts={restPosts}
                locale={typedLocale}
                tMinRead={tCommon('minRead')}
                tReadMore={tCommon('readMore')}
                variant="light"
              />
            )}
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              buildHref={buildHref}
              tPrevious={tCommon('previous')}
              tNext={t('loadMore')}
              tPage={tCommon('page')}
              tOf={tCommon('of')}
              variant="light"
            />
          </>
        ) : (
          <p className="font-sans text-plo-subtle text-center py-24">{t('noResults')}</p>
        )}
      </div>
    </main>
  )
}
