import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  icon?: string | null
  locale: string
  variant?: 'chip' | 'label'
}

export function CategoryBadge({ title, slug, icon, locale, variant = 'chip' }: CategoryBadgeProps) {
  if (variant === 'label') {
    return (
      <Link
        href={`/${locale}/categories/${slug}`}
        className="font-ui text-xs tracking-widest uppercase text-secondary hover:text-secondary/80 transition-colors"
      >
        {icon && <span className="mr-1">{icon}</span>}
        {title}
      </Link>
    )
  }

  return (
    <Link
      href={`/${locale}/categories/${slug}`}
      className="font-ui text-xs tracking-[0.08em] uppercase px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
    >
      {icon && <span className="mr-1">{icon}</span>}
      {title}
    </Link>
  )
}
