import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import { getCategoryBadgeClass } from './CategoryBadge'
import type { Locale } from '@/i18n/routing'
import type { PostCard } from '@/types/blog'

interface FeaturedArticleProps {
  post: PostCard
  locale: Locale
  label: string
  tReadMore?: string
  tMinRead?: string
  /** 'light' pour une section fond blanc (ex. "Dernières publications"), 'dark' ailleurs. */
  variant?: 'dark' | 'light'
}

export function FeaturedArticle({ post, locale, label, tReadMore, tMinRead, variant = 'light' }: FeaturedArticleProps) {
  const title = getLocalizedValue(post.title, locale) ?? 'Untitled'
  const excerpt = getLocalizedValue(post.excerpt, locale)
  const slug = post.slug?.current ?? ''
  const firstCat = post.categories?.[0]
  const catSlug = firstCat?.slug?.current
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(960).height(640).fit('crop').url()
    : null
  const isLight = variant === 'light'

  return (
    <article className={`grid grid-cols-1 md:grid-cols-[55%_45%] gap-0 group ${isLight ? 'card-article-light' : 'card-article'}`}>
      {/* Image */}
      <Link href={`/${locale}/blog/${slug}`} className="block overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={960}
            height={640}
            className="w-full h-full min-h-80 md:min-h-115 object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full min-h-115 ${isLight ? 'bg-plo-off' : 'bg-plo-surface'}`} />
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center px-6 md:px-12 py-8 md:py-0">
        <div className="flex items-center gap-3 mb-5 text-label">
          {firstCat ? (
            <span className={`badge ${getCategoryBadgeClass(catSlug)}`}>{getLocalizedValue(firstCat.title, locale)}</span>
          ) : (
            <span className="text-plo-red">{label}</span>
          )}
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className={isLight ? 'text-plo-subtle' : 'text-plo-gray'}>
              {formatDate(post.publishedAt, locale)}
            </time>
          )}
        </div>

        <Link href={`/${locale}/blog/${slug}`}>
          <h2 className={`text-display text-3xl md:text-4xl group-hover:text-plo-red transition-colors mb-4 ${isLight ? 'text-plo-void' : 'text-plo-white'}`}>
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className={`font-sans text-base leading-relaxed mb-6 line-clamp-3 ${isLight ? 'text-plo-subtle' : 'text-plo-gray'}`}>
            {excerpt}
          </p>
        )}

        <div className={`border-t pt-5 flex items-center justify-between gap-3 ${isLight ? 'border-plo-off' : 'border-plo-border'}`}>
          <div className="flex items-center gap-3">
            {post.author?.image?.asset && (
              <Image
                src={urlFor(post.author.image).width(36).height(36).fit('crop').url()}
                alt={post.author.name ?? ''}
                width={36}
                height={36}
                className="rounded-full"
              />
            )}
            <div className="flex items-center gap-2 text-label">
              {post.author?.name && (
                <span className={isLight ? 'text-plo-void' : 'text-plo-white'}>{post.author.name}</span>
              )}
              {post.readingTime && tMinRead && (
                <>
                  <span className={isLight ? 'text-plo-subtle' : 'text-plo-gray'}>·</span>
                  <span className={isLight ? 'text-plo-subtle' : 'text-plo-gray'}>{post.readingTime} {tMinRead}</span>
                </>
              )}
            </div>
          </div>
          {tReadMore && (
            <Link
              href={`/${locale}/blog/${slug}`}
              className={`text-label shrink-0 group-hover:text-plo-red transition-colors ${isLight ? 'text-plo-void' : 'text-plo-white'}`}
            >
              {tReadMore} →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
