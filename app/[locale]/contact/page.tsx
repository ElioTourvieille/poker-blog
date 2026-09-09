import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ContactForm } from './ContactForm'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
      <ContactForm />
    </main>
  )
}
