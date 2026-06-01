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
      className={className ?? 'font-ui text-sm font-medium bg-primary text-on-primary px-4 py-1.5 rounded-lg hover:bg-primary-container transition-colors'}
    >
      {label}
    </button>
  )
}
