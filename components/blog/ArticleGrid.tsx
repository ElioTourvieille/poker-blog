import { ArticleCard } from './ArticleCard'
import type { PostCard } from '@/types/blog'
import type { Locale } from '@/i18n/routing'

interface ArticleGridProps {
  posts: PostCard[]
  locale: Locale
  tMinRead?: string
  columns?: 2 | 3
}

export function ArticleGrid({ posts, locale, tMinRead, columns = 3 }: ArticleGridProps) {
  const gridClass = columns === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'

  return (
    <div className={gridClass}>
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} locale={locale} tMinRead={tMinRead} />
      ))}
    </div>
  )
}