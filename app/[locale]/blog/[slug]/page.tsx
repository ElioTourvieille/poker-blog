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
import { getCategoryBadgeClass } from '@/components/blog/CategoryBadge'
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
  const catSlug = firstCat?.slug?.current

  // Dernier mot du titre en accent rouge — même traitement que "LIFE." sur le hero homepage.
  const titleWords = title.split(' ')
  const titleLead = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords.at(-1)

  const categoryIds = (post.categories ?? []).map((c) => c._id)
  const related = post._id ? await getRelatedPosts(post._id, categoryIds) : []

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-plo-black" style={{ minHeight: 420 }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={1440}
            height={700}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-plo-black via-plo-black/70 to-plo-black/30" />

        <div className="relative max-w-content mx-auto px-4 md:px-8 py-20 md:py-28 flex flex-col items-center text-center">
          {firstCat && (
            <span className={`badge ${getCategoryBadgeClass(catSlug)} mb-6`}>
              {getLocalizedValue(firstCat.title, typedLocale)}
            </span>
          )}

          <h1 className="text-display text-4xl md:text-6xl text-plo-white leading-[0.95] mb-6">
            {titleLead && <span className="block">{titleLead}</span>}
            <span className="block text-plo-red">{titleAccent}</span>
          </h1>

          <div className="flex items-center gap-2 text-label text-plo-gray">
            {post.author?.name && (
              <span>
                {tCommon('by')} {post.author.name}
              </span>
            )}
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
        </div>
      </div>

      {/* ── Article content ───────────────────────────────────────── */}
      <div className="section-light">
        <div className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-20">
          {excerpt && (
            <p className="font-serif text-xl text-plo-void leading-relaxed mb-10 pb-10 border-b border-plo-off">
              {excerpt}
            </p>
          )}

          {body && <PortableTextRenderer value={body} tone="light" />}

          {/* Newsletter */}
          <div className="mt-16 bg-plo-void p-8 md:p-10">
            <p className="text-display text-xl text-plo-white mb-2">{t('newsletterCta')}</p>
            <p className="font-sans text-sm text-plo-gray mb-6">{t('newsletterCtaBody')}</p>
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      {/* ── Related posts ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-plo-black">
          <div className="max-w-site mx-auto px-4 md:px-16 py-16 md:py-24">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-label text-plo-red mb-2">{t('continueReading')}</p>
                <h2 className="text-display text-3xl md:text-4xl text-plo-white">{t('relatedPosts')}</h2>
              </div>
              <Link href="/blog" className="text-label text-plo-gray hover:text-plo-white transition-colors shrink-0">
                {tCommon('viewAll')} →
              </Link>
            </div>
            <ArticleGrid posts={related} locale={typedLocale} tMinRead={tCommon('minRead')} tReadMore={tCommon('readMore')} />
          </div>
        </section>
      )}
    </main>
  )
}
