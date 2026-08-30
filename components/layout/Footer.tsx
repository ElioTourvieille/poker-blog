import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const NAV_LINKS = [
  { key: 'strategy', href: '/blog?category=strategie' },
  { key: 'obsession', href: '/blog?category=obsession' },
  { key: 'drops', href: '/blog?category=drops' },
]

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tBrand = useTranslations('brand')

  return (
    <footer className="relative bg-inverse-surface text-inverse-on-surface mt-auto overflow-hidden">
      {/* Watermark décoratif — PLO en arrière-plan */}
      <p
        aria-hidden="true"
        className="text-watermark absolute -bottom-6 right-0 text-inverse-on-surface select-none"
      >
        PLO
      </p>

      <div className="relative max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-16">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div>
            <Image src="/brand/Logo-mono-white.png" alt="PLO" width={530} height={235} className="h-10 w-auto" />
            <p className="text-label text-outline mt-3">
              {tBrand('tagline')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="text-label text-outline hover:text-plo-red transition-colors"
              >
                {tNav(key as 'strategy' | 'obsession' | 'drops')}
              </Link>
            ))}
            <Link href="/a-propos" className="text-label text-outline hover:text-plo-red transition-colors">
              {t('links.about')}
            </Link>
            <Link href="/a-propos" className="text-label text-outline hover:text-plo-red transition-colors">
              {t('links.privacy')}
            </Link>
          </nav>
        </div>

        <div className="border-t border-outline-variant pt-6">
          <p className="text-label text-outline">
            © {new Date().getFullYear()} {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
