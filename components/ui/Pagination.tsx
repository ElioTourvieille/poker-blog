import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  pageCount: number
  buildHref: (page: number) => string
  tPrevious: string
  tNext: string
  tPage: string
  tOf: string
}

export function Pagination({
  currentPage,
  pageCount,
  buildHref,
  tPrevious,
  tNext,
  tPage,
  tOf,
}: PaginationProps) {
  if (pageCount <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < pageCount

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - currentPage) <= 1
  )

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      <Link
        href={hasPrev ? buildHref(currentPage - 1) : '#'}
        aria-disabled={!hasPrev}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          hasPrev
            ? 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            : 'opacity-40 pointer-events-none border-transparent'
        }`}
      >
        ← {tPrevious}
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((page, i) => {
          const prev = pages[i - 1]
          const showEllipsis = prev && page - prev > 1
          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-zinc-400">…</span>}
              <Link
                href={buildHref(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {page}
              </Link>
            </span>
          )
        })}
      </div>

      <Link
        href={hasNext ? buildHref(currentPage + 1) : '#'}
        aria-disabled={!hasNext}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          hasNext
            ? 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            : 'opacity-40 pointer-events-none border-transparent'
        }`}
      >
        {tNext} →
      </Link>

      <span className="ml-2 text-sm text-zinc-500">
        {tPage} {currentPage} {tOf} {pageCount}
      </span>
    </nav>
  )
}
