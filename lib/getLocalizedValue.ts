import type { Locale } from '@/i18n/routing'

type LocalizedField<T = string> = {
  fr?: T
  en?: T
}

/**
 * Returns the value for the requested locale, falling back to the other locale
 * or undefined if neither is set.
 */
export function getLocalizedValue<T = string>(
  field: LocalizedField<T> | null | undefined,
  locale: Locale,
): T | undefined {
  if (!field) return undefined
  return field[locale] ?? field[locale === 'fr' ? 'en' : 'fr'] ?? undefined
}
