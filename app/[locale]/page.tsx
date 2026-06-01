import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: t('heroTitle') }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')

  return (
    <main className="flex flex-col flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
          {t('heroTitle')}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          {t('heroSubtitle')}
        </p>
        <a
          href={`/${locale}/blog`}
          className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {tCommon('viewAll')}
        </a>
      </div>
    </main>
  )
}
