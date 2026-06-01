import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPosts, getPostsByCategory, getCategories } from '@/lib/sanity/fetch'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
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

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-on-surface mb-3">
          {activeCategory
            ? getLocalizedValue(activeCategory.title, typedLocale) ?? t('title')
            : t('title')}
        </h1>
        <p className="font-sans text-base text-on-surface-variant">{t('subtitle')}</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-outline-variant">
        <span className="font-ui text-xs tracking-widest uppercase text-outline mr-1">{t('filterBy')} —</span>
        <Link
          href={`/${locale}/blog`}
          className={`font-ui text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors ${
            !category
              ? 'bg-on-surface text-surface'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {tCommon('allCategories')}
        </Link>
        {categoriesData.map((cat) => (
          <Link
            key={cat._id}
            href={`/${locale}/blog?category=${cat.slug?.current}`}
            className={`font-ui text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors ${
              category === cat.slug?.current
                ? 'bg-on-surface text-surface'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {getLocalizedValue(cat.title, typedLocale)}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <>
          <ArticleGrid posts={posts} locale={typedLocale} tMinRead={tCommon('minRead')} />
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            buildHref={buildHref}
            tPrevious={tCommon('previous')}
            tNext={tCommon('next')}
            tPage={tCommon('page')}
            tOf={tCommon('of')}
          />
        </>
      ) : (
        <p className="font-sans text-on-surface-variant text-center py-24">{t('noResults')}</p>
      )}
    </main>
  )
}
