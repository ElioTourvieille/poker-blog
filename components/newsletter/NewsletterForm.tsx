'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { capture } from '@/lib/posthog-client'

type List = 'GENERAL' | 'HAND_OF_WEEK'
type Status = 'idle' | 'loading' | 'success' | 'already_confirmed' | 'error'

interface Props {
  defaultLists?: List[]
  compact?: boolean
}

export function NewsletterForm({ defaultLists = ['GENERAL'], compact = false }: Props) {
  const locale = useLocale()
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
        setErrorMsg('Une erreur est survenue. Réessayez.')
        setStatus('error')
        return
      }

      setStatus(data.status === 'already_confirmed' ? 'already_confirmed' : 'success')
    } catch {
      setErrorMsg('Erreur réseau. Réessayez.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={compact ? 'py-4' : 'py-8'}>
        <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-2">
          Newsletter
        </p>
        <p className="font-serif text-xl font-semibold text-on-surface mb-1">
          Vérifiez votre boîte mail
        </p>
        <p className="font-sans text-sm text-on-surface-variant">
          Un email de confirmation vient d&apos;être envoyé à <strong>{email}</strong>.
          Cliquez sur le lien pour finaliser votre inscription.
        </p>
      </div>
    )
  }

  if (status === 'already_confirmed') {
    return (
      <div className={compact ? 'py-4' : 'py-8'}>
        <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-2">
          Newsletter
        </p>
        <p className="font-serif text-xl font-semibold text-on-surface mb-1">
          Vous êtes déjà inscrit(e)
        </p>
        <p className="font-sans text-sm text-on-surface-variant">
          Vos préférences d&apos;abonnement ont été mises à jour.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? '' : 'py-2'}>
      {!compact && (
        <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-3">
          Newsletter
        </p>
      )}

      {/* Listes */}
      <div className="flex flex-wrap gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lists.includes('GENERAL')}
            onChange={() => toggleList('GENERAL')}
            className="accent-secondary w-4 h-4"
          />
          <span className="font-sans text-sm text-on-surface-variant">
            Résumé hebdomadaire
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lists.includes('HAND_OF_WEEK')}
            onChange={() => toggleList('HAND_OF_WEEK')}
            className="accent-secondary w-4 h-4"
          />
          <span className="font-sans text-sm text-on-surface-variant">
            Main de la semaine
          </span>
        </label>
      </div>

      {/* Email + submit */}
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded px-3 py-2 font-sans text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading' || lists.length === 0}
          className="font-ui text-xs tracking-widest uppercase px-4 py-2 bg-secondary text-on-secondary rounded hover:opacity-90 transition-opacity disabled:opacity-40 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : "S'inscrire"}
        </button>
      </div>

      {status === 'error' && (
        <p className="font-sans text-xs text-error mt-2">{errorMsg}</p>
      )}
    </form>
  )
}
