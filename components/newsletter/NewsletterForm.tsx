'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { capture } from '@/lib/posthog-client'

type List = 'GENERAL' | 'HAND_OF_WEEK'
type Status = 'idle' | 'loading' | 'success' | 'already_confirmed' | 'error'

interface Props {
  defaultLists?: List[]
  compact?: boolean
  /** 'light' pour une section fond blanc (ex. newsletter homepage), 'dark' ailleurs. */
  tone?: 'dark' | 'light'
}

export function NewsletterForm({ defaultLists = ['GENERAL'], compact = false, tone = 'dark' }: Props) {
  const locale = useLocale()
  const isLight = tone === 'light'
  const t = useTranslations('newsletter.form')
  const [email, setEmail] = useState('')
  const [lists, setLists] = useState<List[]>(defaultLists)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggleList(list: List) {
    setLists((prev) =>
      prev.includes(list) ? prev.filter((l) => l !== list) : [...prev, list],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (lists.length === 0) return
    setStatus('loading')
    setErrorMsg('')
    capture('newsletter_subscribe_submitted', { locale, lists })

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, lists }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(t('error'))
        setStatus('error')
        return
      }

      setStatus(data.status === 'already_confirmed' ? 'already_confirmed' : 'success')
    } catch {
      setErrorMsg(t('networkError'))
      setStatus('error')
    }
  }

  const bodyTone = isLight ? 'text-plo-subtle' : 'text-plo-gray'
  const titleTone = isLight ? 'text-plo-void' : 'text-plo-white'

  if (status === 'success') {
    return (
      <div className={compact ? 'py-4' : 'py-8'}>
        <p className="text-label text-plo-red mb-2">Newsletter</p>
        <p className={`text-display text-2xl mb-1 ${titleTone}`}>{t('successTitle')}</p>
        <p className={`font-sans text-sm ${bodyTone}`}>{t('successBody', { email })}</p>
      </div>
    )
  }

  if (status === 'already_confirmed') {
    return (
      <div className={compact ? 'py-4' : 'py-8'}>
        <p className="text-label text-plo-red mb-2">Newsletter</p>
        <p className={`text-display text-2xl mb-1 ${titleTone}`}>{t('alreadyConfirmedTitle')}</p>
        <p className={`font-sans text-sm ${bodyTone}`}>{t('alreadyConfirmedBody')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? '' : 'py-2'}>
      {!compact && <p className="text-label text-plo-red mb-3">Newsletter</p>}

      {/* Listes */}
      <div className="flex flex-wrap gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lists.includes('GENERAL')}
            onChange={() => toggleList('GENERAL')}
            className="accent-plo-red w-4 h-4"
          />
          <span className={`font-sans text-sm ${bodyTone}`}>{t('weeklyOption')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lists.includes('HAND_OF_WEEK')}
            onChange={() => toggleList('HAND_OF_WEEK')}
            className="accent-plo-red w-4 h-4"
          />
          <span className={`font-sans text-sm ${bodyTone}`}>{t('handOption')}</span>
        </label>
      </div>

      {/* Email + submit */}
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className={`input-newsletter flex-1 min-w-0 ${isLight ? '' : 'input-newsletter-dark'}`}
        />
        <button
          type="submit"
          disabled={status === 'loading' || lists.length === 0}
          className="btn-primary whitespace-nowrap disabled:opacity-40"
        >
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>
      </div>

      {status === 'error' && <p className="font-sans text-xs text-plo-red mt-2">{errorMsg}</p>}
    </form>
  )
}
