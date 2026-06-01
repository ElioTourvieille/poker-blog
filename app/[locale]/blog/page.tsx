import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPosts, getPostsByCategory, getCategories } from '@/lib/sanity/fetch'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
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
    category
      ? getPostsByCategory(category, currentPage)
      : getPosts(currentPage),
  ])

  const { posts, pageCount } = postsData

  const buildHref = (p: number) =>
    `/${locale}/blog${category ? `?category=${category}&page=${p}` : `?page=${p}`}`

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('title')}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-zinc-500">{t('filterBy')} :</span>
        <Link
          href={`/${locale}/blog`}
          className={`text-sm px-3 py-1 rounded-full border transition-colors ${
            !category
              ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-transparent'
              : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          {tCommon('allCategories')}
        </Link>
        {categoriesData.map((cat) => {
          const isActive = category === cat.slug?.current
          return isActive ? (
            <CategoryBadge
              key={cat._id}
              title={getLocalizedValue(cat.title, typedLocale) ?? ''}
              slug={cat.slug?.current ?? ''}
              color={cat.color}
              icon={cat.icon}
              locale={typedLocale}
              size="sm"
            />
          ) : (
            <Link
              key={cat._id}
              href={`/${locale}/blog?category=${cat.slug?.current}`}
              className="text-sm px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {getLocalizedValue(cat.title, typedLocale)}
            </Link>
          )
        })}
      </div>

      {posts.length > 0 ? (
        <>
          <ArticleGrid
            posts={posts}
            locale={typedLocale}
            tReadMore={tCommon('readMore')}
            tBy={tCommon('by')}
            tMinRead={tCommon('minRead')}
          />
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
        <p className="text-zinc-500 text-center py-16">{t('noResults')}</p>
      )}
    </main>
  )
}
