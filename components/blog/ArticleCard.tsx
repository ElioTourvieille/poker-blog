import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import { CategoryBadge } from './CategoryBadge'
import type { Locale } from '@/i18n/routing'
import type { PostCard, PostCategory } from '@/types/blog'

export type { PostCard as PostCardData }

interface ArticleCardProps {
  post: PostCard
  locale: Locale
  tReadMore: string
  tBy: string
  tMinRead: string
}

export function ArticleCard({ post, locale, tReadMore, tBy, tMinRead }: ArticleCardProps) {
  const title = getLocalizedValue(post.title, locale) ?? 'Untitled'
  const excerpt = getLocalizedValue(post.excerpt, locale)
  const slug = post.slug?.current ?? ''
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(600).height(380).fit('crop').url()
    : null

  return (
    <article className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      {imageUrl && (
        <Link href={`/${locale}/blog/${slug}`} className="block overflow-hidden aspect-3/2">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? title}
            width={600}
            height={380}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((cat: PostCategory) => (
              <CategoryBadge
                key={cat._id}
                title={getLocalizedValue(cat.title, locale) ?? ''}
                slug={cat.slug?.current ?? ''}
                color={cat.color}
                icon={cat.icon}
                locale={locale}
                size="sm"
              />
            ))}
          </div>
        )}

        <Link href={`/${locale}/blog/${slug}`}>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-snug hover:underline line-clamp-2">
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            {post.author?.image?.asset && (
              <Image
                src={urlFor(post.author.image).width(32).height(32).fit('crop').url()}
                alt={post.author.name ?? ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span>{tBy} {post.author?.name}</span>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} {tMinRead}</span>
              </>
            )}
          </div>
          <Link
            href={`/${locale}/blog/${slug}`}
            className="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            {tReadMore} →
          </Link>
        </div>
      </div>
    </article>
  )
}
