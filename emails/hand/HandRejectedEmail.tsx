import { Heading, Hr, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface HandRejectedEmailProps {
  name: string
  rejectionNote?: string
}

export function HandRejectedEmail({ name, rejectionNote }: HandRejectedEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview="Mise à jour concernant votre soumission de main">
      <Heading style={s.heading}>
        Bonjour {firstName},
      </Heading>

      <Text style={s.text}>
        Nous avons bien examiné la main que vous avez soumise. Malheureusement,
        elle n'a pas été retenue pour la rubrique <strong>Main de la
        semaine</strong> cette fois-ci.
      </Text>

      {rejectionNote && (
        <Section style={s.noteBox}>
          <Text style={s.noteLabel}>Commentaire de l'équipe :</Text>
          <Text style={s.noteText}>{rejectionNote}</Text>
        </Section>
      )}

      <Hr style={s.hr} />

      <Text style={s.encouragement}>
        Ne vous découragez pas ! Chaque semaine de nouvelles mains sont
        sélectionnées. Plus la situation est complexe, instructive, et bien
        décrite, plus elle a de chances d'être choisie.
      </Text>

      <Text style={s.footer}>
        Merci de contribuer à la communauté PokerBlog.
        <br />
        <strong>L'équipe éditoriale</strong>
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
    margin: '0 0 20px',
  },
  noteBox: {
    backgroundColor: '#fafafa',
    border: '1px solid #e2e8f0',
    borderLeft: '3px solid #64748b',
    borderRadius: '0 6px 6px 0',
    padding: '12px 16px',
    margin: '0 0 20px',
  },
  noteLabel: {
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 6px',
    textTransform: 'uppercase' as const,
  },
  noteText: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
    fontStyle: 'italic',
  },
  hr: {
    borderColor: '#e2e8f0',
    margin: '20px 0',
  },
  encouragement: {
    color: '#475569',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  footer: {
    color: '#64748b',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
  },
}

export default function Preview() {
  return (
    <HandRejectedEmail
      name="Jean Dupont"
      rejectionNote="La situation manque de contexte sur les stacks et la tendance du Villain. Essayez de re-soumettre avec plus de détails sur l'historique de la partie."
    />
  )
}
