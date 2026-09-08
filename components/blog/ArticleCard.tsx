import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import { getCategoryBadgeClass } from './CategoryBadge'
import type { Locale } from '@/i18n/routing'
import type { PostCard } from '@/types/blog'

export type { PostCard as PostCardData }

interface ArticleCardProps {
  post: PostCard
  locale: Locale
  tMinRead?: string
  tReadMore?: string
  /** 'light' pour une section fond blanc (liste blog, "Dernières publications"), 'dark' ailleurs. */
  variant?: 'dark' | 'light'
}

export function ArticleCard({ post, locale, tMinRead, tReadMore, variant = 'dark' }: ArticleCardProps) {
  const title = getLocalizedValue(post.title, locale) ?? 'Untitled'
  const excerpt = getLocalizedValue(post.excerpt, locale)
  const slug = post.slug?.current ?? ''
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(720).height(480).fit('crop').url()
    : null
  const firstCat = post.categories?.[0]
  const catSlug = firstCat?.slug?.current
  const isLight = variant === 'light'

  return (
    <article className={`flex flex-col group ${isLight ? 'card-article-light' : 'card-article'}`}>
      <Link href={`/${locale}/blog/${slug}`} className="relative block overflow-hidden aspect-4/3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={720}
            height={480}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full ${isLight ? 'bg-plo-off' : 'bg-plo-surface'}`} />
        )}
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt}
            className="text-label absolute top-3 left-3 text-plo-void bg-plo-white/90 px-2 py-1"
          >
            {formatDate(post.publishedAt, locale)}
          </time>
        )}
        {firstCat && (
          <span className={`badge ${getCategoryBadgeClass(catSlug)} absolute top-3 right-3`}>
            {getLocalizedValue(firstCat.title, locale)}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <Link href={`/${locale}/blog/${slug}`}>
          <h2 className={`text-display text-2xl group-hover:text-plo-red transition-colors mb-2 ${isLight ? 'text-plo-void' : 'text-plo-white'}`}>
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className={`font-sans text-sm leading-relaxed line-clamp-2 mb-4 ${isLight ? 'text-plo-subtle' : 'text-plo-gray'}`}>
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className={`flex items-center gap-2 text-label ${isLight ? 'text-plo-subtle' : 'text-plo-gray'}`}>
            {post.author?.name && <span>{post.author.name}</span>}
            {post.readingTime && tMinRead && (
              <>
                <span>·</span>
                <span>{post.readingTime} {tMinRead}</span>
              </>
            )}
          </div>
          {tReadMore && (
            <Link
              href={`/${locale}/blog/${slug}`}
              className={`text-label group-hover:text-plo-red transition-colors shrink-0 ${isLight ? 'text-plo-void' : 'text-plo-white'}`}
            >
              {tReadMore} →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
