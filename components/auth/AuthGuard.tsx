import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

interface AuthGuardProps {
  children: React.ReactNode
  locale?: string
  requirePremium?: boolean
}

export async function AuthGuard({ children, locale = 'fr', requirePremium = false }: AuthGuardProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(`/${locale}/auth/login`)
  }

  if (requirePremium && !session.user.isPremium && session.user.role !== 'admin') {
    redirect(`/${locale}/auth/premium`)
  }

  return <>{children}</>
}
