import { Button, Heading, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface NewsletterConfirmEmailProps {
  confirmUrl: string
  locale?: 'fr' | 'en'
}

const copy = {
  fr: {
    preview: 'Confirmez votre inscription à la newsletter PokerBlog',
    heading: 'Un dernier clic !',
    body: 'Vous avez demandé à recevoir la newsletter PokerBlog. Confirmez votre adresse pour commencer à recevoir nos analyses hebdomadaires.',
    button: 'Confirmer mon inscription',
    hint: 'Si vous n\'avez pas rempli ce formulaire, ignorez cet email. Aucune action ne sera effectuée.',
  },
  en: {
    preview: 'Confirm your PokerBlog newsletter subscription',
    heading: 'One more click!',
    body: 'You requested to receive the PokerBlog newsletter. Confirm your email address to start receiving our weekly analyses.',
    button: 'Confirm my subscription',
    hint: "If you didn't fill in this form, ignore this email. No action will be taken.",
  },
}

export function NewsletterConfirmEmail({
  confirmUrl,
  locale = 'fr',
}: NewsletterConfirmEmailProps) {
  const t = copy[locale]

  return (
    <EmailLayout preview={t.preview}>
      <Heading style={s.heading}>{t.heading}</Heading>
      <Text style={s.text}>{t.body}</Text>

      <Section style={s.btnSection}>
        <Button href={confirmUrl} style={s.button}>
          {t.button}
        </Button>
      </Section>

      <Text style={s.hint}>{t.hint}</Text>
    </EmailLayout>
  )
}

const s = {
  heading: {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 16px',
  },
  text: {
    color: '#334155',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 28px',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '0 0 24px',
  },
  button: {
    backgroundColor: '#c9a84c',
    borderRadius: '6px',
    color: '#0f172a',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    padding: '14px 32px',
    textDecoration: 'none',
  },
  hint: {
    color: '#94a3b8',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0',
  },
}

export default function Preview() {
  return (
    <NewsletterConfirmEmail
      confirmUrl="http://localhost:3000/api/newsletter/confirm?token=preview"
      locale="fr"
    />
  )
}
