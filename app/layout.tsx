import type { Metadata } from 'next'
import { Noto_Serif, Inter, Work_Sans } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: { default: 'The Royal', template: '%s — The Royal' },
  description: 'Poker. Stratégie. Voyages.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = 'fr'
  try { locale = await getLocale() } catch {}

  return (
    <html
      lang={locale}
      className={`${notoSerif.variable} ${inter.variable} ${workSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  )
}
