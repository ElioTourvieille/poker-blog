import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { formatDate } from '@/lib/formatDate'
import type { Locale } from '@/i18n/routing'
import type { PostCard } from '@/types/blog'

interface FeaturedArticleProps {
  post: PostCard
  locale: Locale
  label: string
  tBy?: string
  tMinRead?: string
}

export function FeaturedArticle({ post, locale, label, tMinRead }: FeaturedArticleProps) {
  const title = getLocalizedValue(post.title, locale) ?? 'Untitled'
  const excerpt = getLocalizedValue(post.excerpt, locale)
  const slug = post.slug?.current ?? ''
  const firstCat = post.categories?.[0]
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(960).height(640).fit('crop').url()
    : null

  return (
    <article className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-0 group">
      {/* Image */}
      <Link href={`/${locale}/blog/${slug}`} className="block overflow-hidden rounded-xl md:rounded-r-none">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={960}
            height={640}
            className="w-full h-full min-h-[320px] md:min-h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full min-h-[460px] bg-surface-container-high" />
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center px-0 md:px-12 py-8 md:py-0">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-ui text-xs tracking-[0.12em] uppercase text-on-surface-variant border border-outline-variant px-2.5 py-1 rounded-full">
            {firstCat ? getLocalizedValue(firstCat.title, locale) : label}
          </span>
        </div>

        <Link href={`/${locale}/blog/${slug}`}>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mb-4">
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className="font-sans text-base text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="border-t border-outline-variant pt-5 flex items-center gap-3">
          {post.author?.image?.asset && (
            <Image
              src={urlFor(post.author.image).width(36).height(36).fit('crop').url()}
              alt={post.author.name ?? ''}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
          <div>
            {post.author?.name && (
              <p className="font-ui text-xs font-medium text-on-surface">{post.author.name}</p>
            )}
            <div className="flex items-center gap-2 font-ui text-xs text-outline">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              )}
              {post.readingTime && tMinRead && (
                <>
                  <span>·</span>
                  <span>{post.readingTime} {tMinRead}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
