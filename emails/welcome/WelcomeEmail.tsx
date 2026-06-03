import { Button, Heading, Hr, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface WelcomeEmailProps {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview={`Bienvenue sur PokerBlog, ${firstName} !`}>
      <Heading style={s.heading}>Bienvenue, {firstName} ! 🃏</Heading>
      <Text style={s.text}>
        Votre compte est créé. Vous faites maintenant partie de la communauté
        PokerBlog — le blog dédié à la stratégie et l'analyse poker.
      </Text>

      <Hr style={s.hr} />

      <Text style={s.subheading}>Ce que vous pouvez faire :</Text>

      {features.map((f) => (
        <Text key={f.label} style={s.feature}>
          <span style={s.dot}>●</span>
          <strong>{f.label}</strong> — {f.desc}
        </Text>
      ))}

      <Hr style={s.hr} />

      <Section style={s.btnSection}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/blog`}
          style={s.button}
        >
          Découvrir les articles
        </Button>
      </Section>

      <Text style={s.footer}>
        À bientôt à la table,
        <br />
        <strong>L'équipe PokerBlog</strong>
      </Text>
    </EmailLayout>
  )
}

const features = [
  { label: 'Commenter', desc: 'réagissez aux analyses et partagez votre vision' },
  { label: 'Soumettre une main', desc: 'proposez une situation pour la rubrique Main de la semaine' },
  { label: 'Newsletter', desc: 'recevez le résumé hebdomadaire des nouveaux articles' },
  { label: 'Premium', desc: 'accédez aux analyses exclusives et aux replays détaillés' },
]

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

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
    margin: '0 0 8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  feature: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '4px 0',
  },
  dot: {
    color: '#c9a84c',
    marginRight: '8px',
    fontSize: '8px',
    verticalAlign: 'middle',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '8px 0 24px',
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
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
  },
}

export default function Preview() {
  return <WelcomeEmail name="Jean Dupont" />
}
