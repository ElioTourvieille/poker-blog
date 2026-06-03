import { Button, Heading, Hr, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export interface PremiumWelcomeEmailProps {
  name: string
}

export function PremiumWelcomeEmail({ name }: PremiumWelcomeEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview={`Bienvenue dans PokerBlog Premium, ${firstName} !`}>
      <Text style={s.badge}>★ Membre Premium</Text>
      <Heading style={s.heading}>
        Bienvenue dans Premium, {firstName} !
      </Heading>

      <Text style={s.text}>
        Votre accès Premium est actif. Vous débloquez maintenant l'intégralité
        du contenu exclusif du site.
      </Text>

      <Hr style={s.hr} />

      <Text style={s.subheading}>Votre accès comprend :</Text>

      {premiumFeatures.map((f) => (
        <Text key={f.label} style={s.feature}>
          <span style={s.check}>✓</span>
          <strong>{f.label}</strong> — {f.desc}
        </Text>
      ))}

      <Hr style={s.hr} />

      <Section style={s.btnSection}>
        <Button href={`${SITE_URL}/blog`} style={s.button}>
          Accéder au contenu Premium
        </Button>
      </Section>

      <Text style={s.footer}>
        Questions ou problème avec votre abonnement ?{' '}
        <a href={`${SITE_URL}/contact`} style={s.link}>
          Contactez-nous
        </a>
        .
      </Text>
    </EmailLayout>
  )
}

const premiumFeatures = [
  {
    label: 'Analyses exclusives',
    desc: 'articles approfondis réservés aux membres Premium',
  },
  {
    label: 'Replays détaillés',
    desc: 'revue de mains complètes avec arbres de décision GTO',
  },
  {
    label: 'Archive complète',
    desc: 'accès à toutes les Mains de la semaine passées et leurs analyses',
  },
  {
    label: 'Priorité de soumission',
    desc: 'vos mains sont examinées en priorité par l\'équipe éditoriale',
  },
]

const s = {
  badge: {
    backgroundColor: '#fef9ee',
    border: '1px solid #c9a84c',
    borderRadius: '20px',
    color: '#92700a',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 16px',
    padding: '4px 12px',
  },
  heading: {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.4',
    margin: '0 0 16px',
  },
  text: {
    color: '#334155',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  hr: {
    borderColor: '#e2e8f0',
    margin: '20px 0',
  },
  subheading: {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 10px',
    textTransform: 'uppercase' as const,
  },
  feature: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '4px 0',
  },
  check: {
    color: '#22c55e',
    fontWeight: '700',
    marginRight: '8px',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '8px 0 20px',
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
  footer: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center' as const,
  },
  link: {
    color: '#c9a84c',
    textDecoration: 'none',
  },
}

export default function Preview() {
  return <PremiumWelcomeEmail name="Jean Dupont" />
}
