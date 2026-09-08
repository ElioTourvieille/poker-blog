'use client'

import { signIn } from '@/lib/auth-client'
import { useLocale } from 'next-intl'

interface LoginButtonProps {
  className?: string
  label?: string
}

export function LoginButton({ className, label = 'Connexion' }: LoginButtonProps) {
  const locale = useLocale()

  const handleGoogleSignIn = () => {
    signIn.social({
      provider: 'google',
      callbackURL: `/${locale}/dashboard`,
    })
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className={className ?? 'text-label px-4 py-2 bg-plo-red text-plo-white hover:bg-plo-red-hover transition-colors'}
    >
      {label}
    </button>
  )
}
