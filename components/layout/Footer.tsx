import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const NAV_LINKS = [
  { key: 'strategy', href: '/blog?category=strategie' },
  { key: 'news', href: '/blog?category=news' },
  { key: 'destinations', href: '/blog?category=destinations' },
  { key: 'lifestyle', href: '/blog?category=lifestyle' },
]

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-12 md:py-16">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div>
            <p className="font-serif text-lg font-semibold tracking-tight text-inverse-on-surface">
              THE ROYAL
            </p>
            <p className="font-ui text-xs text-outline mt-1 tracking-widest uppercase">
              {t('tagline')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-ui text-xs text-outline hover:text-inverse-on-surface tracking-widest uppercase transition-colors"
              >
                {tNav(key as 'strategy' | 'news' | 'destinations' | 'lifestyle')}
              </Link>
            ))}
            <Link href="/a-propos" className="font-ui text-xs text-outline hover:text-inverse-on-surface tracking-widest uppercase transition-colors">
              {t('links.about')}
            </Link>
            <Link href="/a-propos" className="font-ui text-xs text-outline hover:text-inverse-on-surface tracking-widest uppercase transition-colors">
              {t('links.privacy')}
            </Link>
          </nav>
        </div>

        <div className="border-t border-[#404945] pt-6">
          <p className="font-ui text-xs text-outline">
            © {new Date().getFullYear()} {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
