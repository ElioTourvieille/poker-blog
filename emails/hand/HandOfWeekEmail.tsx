import { Button, Heading, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface HandOfWeekEmailProps {
  name: string
  voteUrl: string
  deadline: string
  situation?: string
}

export function HandOfWeekEmail({
  name,
  voteUrl,
  deadline,
  situation,
}: HandOfWeekEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview="Nouvelle main disponible — votez pour la meilleure action !">
      <Text style={s.label}>Main de la semaine</Text>
      <Heading style={s.heading}>
        {firstName}, une nouvelle main vous attend !
      </Heading>

      {situation && (
        <Section style={s.situationBox}>
          <Text style={s.situationLabel}>La situation :</Text>
          <Text style={s.situationText}>{situation}</Text>
        </Section>
      )}

      <Text style={s.text}>
        Une nouvelle main a été soumise par la communauté. Analysez la situation
        et votez pour la meilleure action avant le <strong>{deadline}</strong>.
      </Text>

      <Text style={s.text}>
        L'analyse complète sera publiée dès la clôture du vote.
      </Text>

      <Section style={s.btnSection}>
        <Button href={voteUrl} style={s.button}>
          Voir la main et voter
        </Button>
      </Section>
    </EmailLayout>
  )
}

const s = {
  label: {
    color: '#c9a84c',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    margin: '0 0 8px',
    textTransform: 'uppercase' as const,
  },
  heading: {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 20px',
  },
  situationBox: {
    backgroundColor: '#f8fafc',
    borderLeft: '3px solid #c9a84c',
    borderRadius: '0 6px 6px 0',
    padding: '12px 16px',
    margin: '0 0 20px',
  },
  situationLabel: {
    color: '#c9a84c',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 4px',
    textTransform: 'uppercase' as const,
  },
  situationText: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: 'monospace',
  },
  text: {
    color: '#334155',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '8px 0 0',
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
}

export default function Preview() {
  return (
    <HandOfWeekEmail
      name="Jean Dupont"
      voteUrl="http://localhost:3000/main-de-la-semaine"
      deadline="dimanche 7 juin à 23h59"
      situation="CO vs BTN — 3-bet pot. Board: A♠ K♦ 7♥. Hero (CO) : Q♠ J♠. Pot: 45bb. Hero check, Villain bet 22bb."
    />
  )
}
