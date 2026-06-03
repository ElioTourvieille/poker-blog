import { Button, Heading, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface MagicLinkEmailProps {
  url: string
  email: string
}

export function MagicLinkEmail({ url, email }: MagicLinkEmailProps) {
  return (
    <EmailLayout preview="Votre lien de connexion PokerBlog">
      <Heading style={s.heading}>Connexion à PokerBlog</Heading>
      <Text style={s.text}>
        Cliquez sur le bouton ci-dessous pour vous connecter avec{' '}
        <strong>{email}</strong>. Ce lien expire dans 10 minutes.
      </Text>

      <Section style={s.btnSection}>
        <Button href={url} style={s.button}>
          Se connecter
        </Button>
      </Section>

      <Text style={s.hint}>
        Si vous n'avez pas demandé ce lien, ignorez cet email. Votre compte
        reste sécurisé.
      </Text>
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
    margin: '0 0 24px',
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
    <MagicLinkEmail
      url="http://localhost:3000/api/auth/magic-link/verify?token=preview"
      email="jean.dupont@example.com"
    />
  )
}
