import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCategoryBySlug, getCategoryPaths, getPostsByCategory } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { Pagination } from '@/components/ui/Pagination'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const slugs = await getCategoryPaths()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
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

  const [category, { posts, pageCount }] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug, currentPage),
  ])

  if (!category) notFound()

  const categoryTitle = getLocalizedValue(category.title, typedLocale) ?? slug
  const description = getLocalizedValue(category.description, typedLocale)

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 w-full">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: `/${locale}` },
          { label: tCommon('categories'), href: `/${locale}/blog` },
          { label: categoryTitle },
        ]}
      />

      <div className="mt-8 mb-10 flex items-center gap-3">
        {category.icon && (
          <span className="text-4xl" aria-hidden>{category.icon}</span>
        )}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
            style={category.color ? { color: category.color } : undefined}>
            {categoryTitle}
          </h1>
          {description && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{description}</p>
          )}
        </div>
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
            buildHref={(p) => `/${locale}/categories/${slug}?page=${p}`}
            tPrevious={tCommon('previous')}
            tNext={tCommon('next')}
            tPage={tCommon('page')}
            tOf={tCommon('of')}
          />
        </>
      ) : (
        <p className="text-zinc-500 text-center py-16">{tCommon('noResults')}</p>
      )}
    </main>
  )
}
