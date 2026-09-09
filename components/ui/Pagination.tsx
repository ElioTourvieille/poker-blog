import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  pageCount: number
  buildHref: (page: number) => string
  tPrevious: string
  tNext: string
  tPage: string
  tOf: string
  /** 'light' pour une section fond blanc (bouton contour sombre), 'dark' pour le reste du site. */
  variant?: 'dark' | 'light'
}

export function Pagination({
  currentPage,
  pageCount,
  buildHref,
  tPrevious,
  tNext: tLoadMore,
  tPage,
  tOf,
  variant = 'dark',
}: PaginationProps) {
  if (pageCount <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < pageCount
  const isLight = variant === 'light'

  return (
    <nav className="flex flex-col items-center gap-4 mt-16" aria-label="Pagination">
      {hasNext && (
        <Link
          href={buildHref(currentPage + 1)}
          className={`inline-flex items-center gap-2 ${isLight ? 'btn-outline-dark' : 'btn-secondary'}`}
        >
          {tLoadMore}
          <span aria-hidden>↓</span>
        </Link>
      )}

      <div className="flex items-center gap-4">
        {hasPrev && (
          <Link
            href={buildHref(currentPage - 1)}
            className={`text-label transition-colors ${
              isLight ? 'text-plo-subtle hover:text-plo-void' : 'text-plo-gray hover:text-plo-white'
            }`}
          >
            ← {tPrevious}
          </Link>
        )}
        <span className={`text-label ${isLight ? 'text-plo-subtle' : 'text-plo-gray'}`}>
          {tPage} {currentPage} {tOf} {pageCount}
        </span>
      </div>
    </nav>
  )
}
