import { Button, Heading, Hr, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface HandSelectedEmailProps {
  name: string
  publishUrl: string
  board?: string
  situation?: string
}

export function HandSelectedEmail({
  name,
  publishUrl,
  board,
  situation,
}: HandSelectedEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview="Votre main a été sélectionnée comme Main de la semaine !">
      <Text style={s.badge}>🏆 Sélectionnée</Text>
      <Heading style={s.heading}>
        Félicitations {firstName}, votre main a été choisie !
      </Heading>

      <Text style={s.text}>
        Parmi toutes les soumissions reçues cette semaine, votre main a été
        sélectionnée par l'équipe éditoriale pour devenir la <strong>Main de
        la semaine</strong>. Elle sera soumise au vote de la communauté, puis
        analysée en détail.
      </Text>

      {(board || situation) && (
        <Section style={s.handBox}>
          {board && (
            <>
              <Text style={s.handLabel}>Board</Text>
              <Text style={s.handValue}>{board}</Text>
            </>
          )}
          {situation && (
            <>
              {board && <Hr style={s.innerHr} />}
              <Text style={s.handLabel}>Situation</Text>
              <Text style={s.handValue}>{situation}</Text>
            </>
          )}
        </Section>
      )}

      <Section style={s.btnSection}>
        <Button href={publishUrl} style={s.button}>
          Voir la publication
        </Button>
      </Section>

      <Text style={s.thanks}>
        Merci de contribuer à la qualité du contenu de PokerBlog !
      </Text>
    </EmailLayout>
  )
}

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
  handBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px',
    margin: '0 0 24px',
  },
  handLabel: {
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 2px',
    textTransform: 'uppercase' as const,
  },
  handValue: {
    color: '#0f172a',
    fontSize: '15px',
    fontFamily: 'monospace',
    margin: '0',
    lineHeight: '1.5',
  },
  innerHr: {
    borderColor: '#e2e8f0',
    margin: '10px 0',
  },
  btnSection: {
    textAlign: 'center' as const,
    margin: '0 0 20px',
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
  thanks: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center' as const,
  },
}

export default function Preview() {
  return (
    <HandSelectedEmail
      name="Jean Dupont"
      publishUrl="http://localhost:3000/blog/main-semaine"
      board="A♠ K♦ 7♥"
      situation="CO vs BTN — 3-bet pot. Pot: 45bb. Hero check, Villain bet 22bb."
    />
  )
}
