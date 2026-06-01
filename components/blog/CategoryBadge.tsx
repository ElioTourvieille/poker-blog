import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  color?: string | null
  icon?: string | null
  locale: string
  size?: 'sm' | 'md'
}

export function CategoryBadge({ title, slug, color, icon, locale, size = 'md' }: CategoryBadgeProps) {
  const bg = color ?? '#6b7280'
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <Link
      href={`/${locale}/categories/${slug}`}
      className={`inline-flex items-center gap-1 rounded-full font-medium text-white transition-opacity hover:opacity-80 ${sizeClass}`}
      style={{ backgroundColor: bg }}
    >
      {icon && <span>{icon}</span>}
      {title}
    </Link>
  )
}
