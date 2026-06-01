import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlProxy = createIntlMiddleware(routing)

// Chemins (sans préfixe locale) qui nécessitent une session
const PROTECTED_PATHS = ['/dashboard', '/submit-hand', '/profile']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Retirer le préfixe locale pour évaluer les chemins protégés
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/'

  if (PROTECTED_PATHS.some((p) => withoutLocale.startsWith(p))) {
    // Vérification légère : présence du cookie de session Better Auth
    const sessionToken =
      request.cookies.get('better-auth.session_token')?.value ??
      request.cookies.get('__Secure-better-auth.session_token')?.value

    if (!sessionToken) {
      const localeMatch = pathname.match(/^\/([a-z]{2})/)
      const locale = localeMatch?.[1] ?? 'fr'
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Déléguer le reste à next-intl (détection de langue + redirections)
  return intlProxy(request)
}

export const config = {
  matcher: [
    // Toutes les routes sauf studio, API, _next et fichiers statiques
    '/((?!studio|api|_next|_vercel|.*\\..*).*)',
  ],
}
