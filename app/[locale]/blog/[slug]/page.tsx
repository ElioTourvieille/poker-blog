import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPostBySlug, getPostPaths, getRelatedPosts } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextRenderer } from '@/components/blog/PortableTextRenderer'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { BlockContent } from '@/sanity.types'
import type { Metadata } from 'next'
import Image from 'next/image'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getPostPaths()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = getLocalizedValue(post.title, locale as Locale)
  const description = post.seo?.metaDescription ?? getLocalizedValue(post.excerpt, locale as Locale) ?? ''
  return {
    title,
    description,
    openGraph: post.seo?.ogImage
      ? { images: [{ url: urlFor(post.seo.ogImage).width(1200).height(630).url() }] }
      : undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations('post')
  const tCommon = await getTranslations('common')
  const typedLocale = locale as Locale

  const title = getLocalizedValue(post.title, typedLocale) ?? 'Untitled'
  const body = getLocalizedValue(post.body as { fr?: BlockContent; en?: BlockContent } | null, typedLocale)
  const excerpt = getLocalizedValue(post.excerpt, typedLocale)
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : null

  const categoryIds = (post.categories ?? []).map((c) => c._id)
  const related = post._id ? await getRelatedPosts(post._id, categoryIds) : []

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 w-full">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: `/${locale}` },
          { label: tCommon('backToBlog'), href: `/${locale}/blog` },
          { label: title },
        ]}
      />

      <article className="mt-8">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <CategoryBadge
                key={cat._id}
                title={getLocalizedValue(cat.title, typedLocale) ?? ''}
                slug={cat.slug?.current ?? ''}
                color={cat.color}
                icon={cat.icon}
                locale={typedLocale}
                size="sm"
              />
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
          {title}
        </h1>

        {excerpt && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">{excerpt}</p>
        )}

        <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          {post.author?.name && <span>{tCommon('by')} <strong className="text-zinc-700 dark:text-zinc-300">{post.author.name}</strong></span>}
          {post.publishedAt && (
            <>
              <span>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            </>
          )}
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} {tCommon('minRead')}</span>
            </>
          )}
        </div>

        {imageUrl && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt ?? title}
              width={1200}
              height={630}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {body && (
          <PortableTextRenderer value={body} />
        )}
      </article>

      {/* Author */}
      {post.author && (
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">{t('authorAbout')}</h2>
          <AuthorCard author={post.author as Parameters<typeof AuthorCard>[0]['author']} locale={typedLocale} />
        </div>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">{t('relatedPosts')}</h2>
          <ArticleGrid
            posts={related}
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
