import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAuthorBySlug, getAuthorPaths, getPostsByAuthor } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAuthorPaths()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  return { title: author?.name ?? slug }
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const tAuthor = await getTranslations('author')
  const tCommon = await getTranslations('common')

  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPostsByAuthor(slug),
  ])

  if (!author) notFound()

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 w-full">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: `/${locale}` },
          { label: tAuthor('posts') },
        ]}
      />

      <div className="mt-8 mb-12">
        <AuthorCard author={author} locale={typedLocale} />
      </div>

      <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">{tAuthor('posts')}</h2>

      {posts.length > 0 ? (
        <ArticleGrid
          posts={posts}
          locale={typedLocale}
          tReadMore={tCommon('readMore')}
          tBy={tCommon('by')}
          tMinRead={tCommon('minRead')}
        />
      ) : (
        <p className="text-zinc-500 text-center py-16">{tAuthor('noPosts')}</p>
      )}
    </main>
  )
}
