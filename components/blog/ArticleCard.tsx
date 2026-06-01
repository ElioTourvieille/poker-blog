import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import type { Locale } from '@/i18n/routing'
import type { PostCard } from '@/types/blog'

export type { PostCard as PostCardData }

interface ArticleCardProps {
  post: PostCard
  locale: Locale
  tMinRead?: string
}

export function ArticleCard({ post, locale, tMinRead }: ArticleCardProps) {
  const title = getLocalizedValue(post.title, locale) ?? 'Untitled'
  const excerpt = getLocalizedValue(post.excerpt, locale)
  const slug = post.slug?.current ?? ''
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(720).height(480).fit('crop').url()
    : null
  const firstCat = post.categories?.[0]

  return (
    <article className="flex flex-col group">
      {imageUrl ? (
        <Link href={`/${locale}/blog/${slug}`} className="block overflow-hidden rounded-xl mb-4">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={720}
            height={480}
            className="w-full aspect-4/3 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : (
        <div className="rounded-xl mb-4 bg-surface-container-high aspect-4/3" />
      )}

      {firstCat && (
        <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-2">
          {getLocalizedValue(firstCat.title, locale)}
        </p>
      )}

      <Link href={`/${locale}/blog/${slug}`}>
        <h2 className="font-serif text-xl font-semibold text-on-surface leading-snug group-hover:text-primary transition-colors mb-2">
          {title}
        </h2>
      </Link>

      {excerpt && (
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-3">
          {excerpt}
        </p>
      )}

      <div className="flex items-center gap-2 font-ui text-xs text-outline mt-auto">
        {post.author?.name && <span>{post.author.name}</span>}
        {post.publishedAt && (
          <>
            <span>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          </>
        )}
        {post.readingTime && tMinRead && (
          <>
            <span>·</span>
            <span>{post.readingTime} {tMinRead}</span>
          </>
        )}
      </div>
    </article>
  )
}
