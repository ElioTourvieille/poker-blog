import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { fonts } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'PLO — Poker. Life. Obsession.', template: '%s — PLO' },
  description:
    'Le journal du grinder moderne. Stratégie, culture poker, lifestyle et communauté.',
  keywords: ['poker', 'PLO', 'stratégie poker', 'poker france', 'lifestyle poker'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = 'fr'
  try { locale = await getLocale() } catch {}

  return (
    <html lang={locale} className={fonts.variables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  )
}
