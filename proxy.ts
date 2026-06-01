import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except studio, API, Next.js internals, and static files
    '/((?!studio|api|_next|_vercel|.*\\..*).*)',
  ],
}
