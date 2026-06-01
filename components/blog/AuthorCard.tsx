import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/lib/getLocalizedValue'
import type { Locale } from '@/i18n/routing'

type BioBLock = { _type: string; _key: string; children?: { text?: string }[] }

type AuthorCardData = {
  name: string | null
  slug: { current?: string | null } | null
  image: { asset?: { _ref: string } } | null
  bio?: { fr?: BioBLock[] | null; en?: BioBLock[] | null } | null
  socialLinks?: {
    twitter?: string | null
    instagram?: string | null
    linkedin?: string | null
  } | null
}

interface AuthorCardProps {
  author: AuthorCardData
  locale: Locale
  label?: string
}

export function AuthorCard({ author, locale, label }: AuthorCardProps) {
  const bioLocalized = getLocalizedValue(author.bio as { fr?: unknown; en?: unknown } | null | undefined, locale)
  const imageUrl = author.image?.asset
    ? urlFor(author.image).width(80).height(80).fit('crop').url()
    : null

  const excerpt = bioLocalized
    ? (bioLocalized as BioBLock[])
        .filter((b) => b._type === 'block')
        .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
        .join(' ')
        .slice(0, 200)
    : null

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={author.name ?? ''}
          width={80}
          height={80}
          className="rounded-full shrink-0 self-start"
        />
      )}
      <div className="flex flex-col gap-1">
        {label && <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>}
        <Link
          href={`/${locale}/auteurs/${author.slug?.current ?? ''}`}
          className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
        >
          {author.name}
        </Link>
        {excerpt && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{excerpt}…</p>
        )}
        {author.socialLinks && (
          <div className="flex gap-3 mt-1">
            {author.socialLinks.twitter && (
              <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                Twitter
              </a>
            )}
            {author.socialLinks.instagram && (
              <a href={author.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                Instagram
              </a>
            )}
            {author.socialLinks.linkedin && (
              <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
