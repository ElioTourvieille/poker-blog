import { setRequestLocale } from 'next-intl/server'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export const metadata: Metadata = {
  title: 'Newsletter — PokerBlog',
  description: 'Abonnez-vous pour recevoir les analyses poker, le résumé hebdomadaire et les notifications Main de la semaine.',
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { locale } = await params
  const query = await searchParams
  setRequestLocale(locale)

  const confirmed = query.confirmed === 'true'
  const unsubscribed = query.unsubscribed === 'true'
  const error = query.error as string | undefined

  return (
    <main className="max-w-[640px] mx-auto px-4 md:px-8 py-16 md:py-24">
      <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-4">
        Newsletter
      </p>

      {/* ── Feedback states ──────────────────────────────────────── */}
      {confirmed && (
        <div className="mb-10 p-5 bg-surface-container rounded-lg border border-outline-variant">
          <p className="font-serif text-xl font-semibold text-on-surface mb-2">
            Inscription confirmée !
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            Vous êtes maintenant abonné(e) à la newsletter PokerBlog.
            Bienvenue dans la communauté.
          </p>
        </div>
      )}

      {unsubscribed && (
        <div className="mb-10 p-5 bg-surface-container rounded-lg border border-outline-variant">
          <p className="font-serif text-xl font-semibold text-on-surface mb-2">
            Désinscription effectuée
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            Votre adresse a bien été retirée de notre liste. Vous ne recevrez plus d'emails de notre part.
          </p>
        </div>
      )}

      {error && !confirmed && !unsubscribed && (
        <div className="mb-10 p-5 bg-surface-container rounded-lg border border-error/30">
          <p className="font-serif text-xl font-semibold text-on-surface mb-2">
            Lien invalide ou expiré
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            Ce lien ne fonctionne plus. Réinscrivez-vous ci-dessous pour recevoir un nouveau lien.
          </p>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight mb-6">
        Restez au niveau
      </h1>
      <p className="font-sans text-lg text-on-surface-variant leading-relaxed mb-10">
        Analyses stratégiques, mains commentées, théorie GTO — directement dans votre boîte mail.
        Pas de spam, juste du contenu utile.
      </p>

      {/* ── Offer cards ──────────────────────────────────────────── */}
      <div className="grid gap-4 mb-10">
        <div className="p-5 border border-outline-variant rounded-lg">
          <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-2">
            Résumé hebdomadaire
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            Chaque lundi matin — les nouveaux articles de la semaine résumés en un email.
          </p>
        </div>
        <div className="p-5 border border-outline-variant rounded-lg">
          <p className="font-ui text-xs tracking-widest uppercase text-secondary mb-2">
            Main de la semaine
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            Notification quand une nouvelle main est disponible pour le vote, et quand l'analyse est publiée.
          </p>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────── */}
      <div className="border-t border-outline-variant pt-8">
        <p className="font-serif text-xl font-semibold text-on-surface mb-6">
          Choisissez vos abonnements
        </p>
        <NewsletterForm defaultLists={['GENERAL', 'HAND_OF_WEEK']} />
      </div>
    </main>
  )
}
