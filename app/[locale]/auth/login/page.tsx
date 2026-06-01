'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { signIn, authClient } from '@/lib/auth-client'
import Link from 'next/link'

export default function LoginPage() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: session } = authClient.useSession()
  if (session) {
    if (typeof window !== 'undefined') window.location.href = `/${locale}/dashboard`
    return null
  }

  const handleGoogleSignIn = () => {
    signIn.social({ provider: 'google', callbackURL: `/${locale}/dashboard` })
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: `/${locale}/dashboard`,
    })
    setLoading(false)
    if (result.error) {
      setError('Une erreur est survenue. Réessaie.')
    } else {
      setMagicSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <Link href={`/${locale}`} className="block text-center mb-12">
          <span className="font-serif text-2xl font-semibold text-on-surface">The Royal</span>
          <p className="font-ui text-xs tracking-widest uppercase text-outline mt-1">Le jeu discret</p>
        </Link>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8">
          <h1 className="font-serif text-2xl font-semibold text-on-surface mb-2">Connexion</h1>
          <p className="font-sans text-sm text-on-surface-variant mb-8">
            Accède à ton espace et rejoins la communauté.
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded-xl px-4 py-3 font-ui text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="font-ui text-xs text-outline uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* Magic Link */}
          {magicSent ? (
            <div className="text-center py-4">
              <p className="font-ui text-sm text-primary font-medium">✓ Lien envoyé !</p>
              <p className="font-sans text-sm text-on-surface-variant mt-1">
                Vérifie ta boîte mail pour te connecter.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-sans text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-colors"
              />
              {error && <p className="font-ui text-xs text-secondary">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-ui text-sm font-medium py-3 rounded-xl hover:bg-primary-container transition-colors disabled:opacity-60"
              >
                {loading ? 'Envoi…' : 'Recevoir un lien magique'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center font-ui text-xs text-outline mt-6">
          En continuant, tu acceptes nos{' '}
          <Link href={`/${locale}/a-propos`} className="underline hover:text-on-surface">
            conditions d&apos;utilisation
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
