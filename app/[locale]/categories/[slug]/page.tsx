import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCategoryBySlug, getCategoryPaths, getPostsByCategory } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { Pagination } from '@/components/ui/Pagination'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const slugs = await getCategoryPaths()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return { title: getLocalizedValue(category.title, locale as Locale) ?? slug }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { page: pageParam } = await searchParams
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const currentPage = Math.max(1, Number(pageParam ?? 1))
  const tCommon = await getTranslations('common')
  const tBlog = await getTranslations('blog')

  const [category, { posts, pageCount }] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug, currentPage),
  ])

  if (!category) notFound()

  const categoryTitle = getLocalizedValue(category.title, typedLocale) ?? slug
  const description = getLocalizedValue(category.description, typedLocale)

  return (
    <main className="max-w-site mx-auto px-4 md:px-16 py-16 md:py-24">
      <div className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-3">
          {category.icon && <span className="text-3xl" aria-hidden>{category.icon}</span>}
          <h1 className="text-display text-4xl md:text-5xl text-plo-white">
            {categoryTitle}
          </h1>
        </div>
        {description && (
          <p className="font-sans text-base text-plo-gray max-w-xl">{description}</p>
        )}
      </div>

      <div className="border-t border-plo-border mb-12" />

      {posts.length > 0 ? (
        <>
          <ArticleGrid posts={posts} locale={typedLocale} tMinRead={tCommon('minRead')} tReadMore={tCommon('readMore')} />
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            buildHref={(p) => `/${locale}/categories/${slug}?page=${p}`}
            tPrevious={tCommon('previous')}
            tNext={tBlog('loadMore')}
            tPage={tCommon('page')}
            tOf={tCommon('of')}
          />
        </>
      ) : (
        <p className="font-sans text-plo-gray text-center py-24">{tCommon('noResults')}</p>
      )}
    </main>
  )
}
