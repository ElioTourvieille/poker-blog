import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { getPostBySlug, getPostPaths, getRelatedPosts } from '@/lib/sanity/fetch'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextRenderer } from '@/components/blog/PortableTextRenderer'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import type { BlockContent } from '@/sanity.types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getPostPaths()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
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
    ? urlFor(post.mainImage).width(1440).height(700).fit('crop').url()
    : null
  const firstCat = post.categories?.[0]

  const categoryIds = (post.categories ?? []).map((c) => c._id)
  const related = post._id ? await getRelatedPosts(post._id, categoryIds) : []

  return (
    <main>
      {/* ── Hero image ────────────────────────────────────────────── */}
      {imageUrl && (
        <div className="relative w-full overflow-hidden" style={{ maxHeight: 520 }}>
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={1440}
            height={700}
            className="w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface/60 to-transparent" />
        </div>
      )}

      {/* ── Article content ───────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* Category */}
        {firstCat && (
          <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-5">
            {getLocalizedValue(firstCat.title, typedLocale)}
          </p>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight mb-6">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-sans text-xl text-on-surface-variant leading-relaxed mb-8 border-b border-outline-variant pb-8">
            {excerpt}
          </p>
        )}

        {/* Author + meta */}
        <div className="flex items-center gap-4 mb-12">
          {post.author?.image?.asset && (
            <Image
              src={urlFor(post.author.image).width(44).height(44).fit('crop').url()}
              alt={post.author.name ?? ''}
              width={44}
              height={44}
              className="rounded-full shrink-0"
            />
          )}
          <div className="flex flex-col">
            {post.author?.name && (
              <span className="font-ui text-sm font-medium text-on-surface">{post.author.name}</span>
            )}
            <div className="flex items-center gap-2 font-ui text-xs text-outline">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              )}
              {post.readingTime && (
                <>
                  <span>·</span>
                  <span>{post.readingTime} {tCommon('minRead')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        {body && <PortableTextRenderer value={body} />}

        {/* Newsletter */}
        <div className="mt-16 pt-10 border-t border-outline-variant">
          <p className="font-serif text-xl font-semibold text-on-surface mb-2">
            Vous avez aimé cet article ?
          </p>
          <p className="font-sans text-sm text-on-surface-variant mb-6">
            Recevez chaque semaine les nouvelles analyses directement dans votre boîte mail.
          </p>
          <NewsletterForm compact />
        </div>
      </div>

      {/* ── Related posts ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-16 pb-24">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-t border-b border-outline-variant py-4">
            <h2 className="font-serif text-2xl font-semibold text-on-surface">{t('relatedPosts')}</h2>
            <Link href="/blog" className="font-ui text-xs tracking-widest uppercase text-secondary">
              {tCommon('viewAll')} →
            </Link>
          </div>
          <ArticleGrid posts={related} locale={typedLocale} tMinRead={tCommon('minRead')} />
        </section>
      )}
    </main>
  )
}
