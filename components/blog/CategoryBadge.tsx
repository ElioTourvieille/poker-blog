import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  icon?: string | null
  locale: string
  variant?: 'chip' | 'label'
}

/**
 * Les 3 piliers éditoriaux (Stratégie/Obsession/Drops) ont chacun une couleur de
 * badge dédiée dans le design system (voir docs/design-tokens.md). `category` est un
 * document Sanity libre (pas d'enum) — ce mapping est une convention éditoriale, pas
 * une contrainte de schéma. Toute catégorie hors de ces 3 slugs retombe sur le style
 * "drops" (neutre) plutôt que de planter.
 */
export function getCategoryBadgeClass(slug?: string | null): string {
  switch (slug) {
    case 'strategie':
      return 'badge-strategie'
    case 'obsession':
      return 'badge-obsession'
    case 'drops':
      return 'badge-drops'
    default:
      return 'badge-drops'
  }
}

export function CategoryBadge({ title, slug, icon, locale, variant = 'chip' }: CategoryBadgeProps) {
  if (variant === 'label') {
    return (
      <Link
        href={`/${locale}/categories/${slug}`}
        className="text-label text-plo-red hover:text-plo-red-hover transition-colors"
      >
        {icon && <span className="mr-1">{icon}</span>}
        {title}
      </Link>
    )
  }

  return (
    <Link href={`/${locale}/categories/${slug}`} className={`badge ${getCategoryBadgeClass(slug)} hover:border-plo-red transition-colors`}>
      {icon && <span className="mr-1">{icon}</span>}
      {title}
    </Link>
  )
}
