import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { getAuthorBySlug, getAuthorPaths, getPostsByAuthor } from '@/lib/sanity/fetch'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { urlFor } from '@/sanity/lib/image'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAuthorPaths()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
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

  const imageUrl = author.image?.asset
    ? urlFor(author.image).width(120).height(120).fit('crop').url()
    : null

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-16 md:py-24">
      {/* Author header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-16 pb-12 border-b border-outline-variant">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={author.name ?? ''}
            width={96}
            height={96}
            className="rounded-full shrink-0"
          />
        )}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-on-surface mb-2">
            {author.name}
          </h1>
          {author.socialLinks && (
            <div className="flex gap-4 mt-3">
              {author.socialLinks.twitter && (
                <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="font-ui text-xs tracking-widest uppercase text-outline hover:text-on-surface transition-colors">
                  Twitter
                </a>
              )}
              {author.socialLinks.instagram && (
                <a href={author.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="font-ui text-xs tracking-widest uppercase text-outline hover:text-on-surface transition-colors">
                  Instagram
                </a>
              )}
              {author.socialLinks.linkedin && (
                <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="font-ui text-xs tracking-widest uppercase text-outline hover:text-on-surface transition-colors">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif text-2xl font-semibold text-on-surface">{tAuthor('posts')}</h2>
      </div>

      {posts.length > 0 ? (
        <ArticleGrid posts={posts} locale={typedLocale} tMinRead={tCommon('minRead')} />
      ) : (
        <p className="font-sans text-on-surface-variant text-center py-24">{tAuthor('noPosts')}</p>
      )}
    </main>
  )
}
