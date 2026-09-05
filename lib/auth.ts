import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { sendMagicLinkEmail, sendWelcomeEmail } from '@/lib/mailer'
import { captureServerEvent } from '@/lib/posthog-server'
import { parseConsentCookie } from '@/lib/consent'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          await sendWelcomeEmail({ name: user.name, email: user.email })

          // Même consentement que côté client (voir lib/consent.ts) — pas
          // d'event si "Refuser" ou pas de choix fait.
          const cookieHeader = context?.request?.headers.get('cookie')
          if (parseConsentCookie(cookieHeader) === 'granted') {
            captureServerEvent(user.id, 'user_signed_up')
          }
        },
      },
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url })
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
      isPremium: {
        type: 'boolean',
        defaultValue: false,
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24,      // refresh quotidien
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,             // cache 5 min côté client
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
