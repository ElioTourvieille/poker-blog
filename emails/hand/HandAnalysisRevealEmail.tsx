import { Button, Heading, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface HandAnalysisRevealEmailProps {
  name: string
  analysisUrl: string
  situation?: string
}

export function HandAnalysisRevealEmail({
  name,
  analysisUrl,
  situation,
}: HandAnalysisRevealEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview="L'analyse de la Main de la semaine est publiée !">
      <Text style={s.label}>Main de la semaine</Text>
      <Heading style={s.heading}>
        {firstName}, l'analyse est disponible !
      </Heading>

      {situation && (
        <Section style={s.situationBox}>
          <Text style={s.situationLabel}>La main analysée :</Text>
          <Text style={s.situationText}>{situation}</Text>
        </Section>
      )}

      <Text style={s.text}>
        Le vote est clôturé et l'analyse complète vient d'être publiée.
        Découvrez quelle action était la plus profitable, le raisonnement GTO
        derrière, et les résultats du vote de la communauté.
      </Text>

      <Section style={s.btnSection}>
        <Button href={analysisUrl} style={s.button}>
          Lire l'analyse complète
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
    margin: '0 0 24px',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '0',
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
    <HandAnalysisRevealEmail
      name="Jean Dupont"
      analysisUrl="http://localhost:3000/blog/main-semaine-analyse"
      situation="CO vs BTN — 3-bet pot. Board: A♠ K♦ 7♥. Hero (CO) : Q♠ J♠. Pot: 45bb."
    />
  )
}
