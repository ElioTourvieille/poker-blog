'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useSession } from '@/lib/auth-client'
import { UserMenu } from '@/components/auth/UserMenu'
import { LoginButton } from '@/components/auth/LoginButton'

const NAV_LINKS = [
  { key: 'strategy' as const, href: '/blog?category=strategie' },
  { key: 'obsession' as const, href: '/blog?category=obsession' },
  { key: 'drops' as const, href: '/blog?category=drops' },
]

export function Navbar() {
  const t = useTranslations('nav')
  const tBrand = useTranslations('brand')
  const tLang = useTranslations('lang')
  const locale = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, isPending } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant">
      <nav className="max-w-7xl mx-auto px-4 md:px-16 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-3" aria-label="PLO — Poker. Life. Obsession.">
          <Image src="/brand/Logo-mono-white.png" alt="PLO" width={530} height={235} className="h-8 w-auto" priority />
          <span className="hidden lg:block w-px h-4 bg-outline-variant" aria-hidden="true" />
          <span className="hidden lg:block text-label text-on-surface-variant whitespace-nowrap">
            {tBrand('tagline')}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, href }) => (
            <Link key={key} href={href}
              className="text-label text-on-surface-variant hover:text-plo-red transition-colors">
              {t(key)}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link href={pathname} locale={locale === 'fr' ? 'en' : 'fr'}
            className="text-label text-on-surface-variant hover:text-plo-red transition-colors">
            {tLang('switch')}
          </Link>
          {!isPending && (
            session ? <UserMenu /> : <LoginButton />
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-on-surface" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ key, href }) => (
            <Link key={key} href={href} onClick={() => setMenuOpen(false)}
              className="text-label text-on-surface-variant py-1">
              {t(key)}
            </Link>
          ))}
          <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
            <Link href={pathname} locale={locale === 'fr' ? 'en' : 'fr'}
              className="text-label text-on-surface-variant">
              {tLang('switch')}
            </Link>
            {session ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      )}
    </header>
  )
}
