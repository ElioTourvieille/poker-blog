import { ArticleCard } from './ArticleCard'
import type { PostCard } from '@/types/blog'
import type { Locale } from '@/i18n/routing'

interface ArticleGridProps {
  posts: PostCard[]
  locale: Locale
  tReadMore: string
  tBy: string
  tMinRead: string
}

export function ArticleGrid({ posts, locale, tReadMore, tBy, tMinRead }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard
          key={post._id}
          post={post}
          locale={locale}
          tReadMore={tReadMore}
          tBy={tBy}
          tMinRead={tMinRead}
        />
      ))}
    </div>
  )
}
