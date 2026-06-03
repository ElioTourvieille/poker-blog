import { Button, Heading, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

export interface CommentReplyEmailProps {
  name: string
  commenterName: string
  originalComment: string
  replyText: string
  replyUrl: string
  postTitle: string
}

export function CommentReplyEmail({
  name,
  commenterName,
  originalComment,
  replyText,
  replyUrl,
  postTitle,
}: CommentReplyEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview={`${commenterName} a répondu à votre commentaire`}>
      <Heading style={s.heading}>
        {firstName}, quelqu'un a répondu à votre commentaire
      </Heading>

      <Text style={s.article}>
        Sur l'article : <strong>{postTitle}</strong>
      </Text>

      <Section style={s.threadBox}>
        <Text style={s.threadLabel}>Votre commentaire</Text>
        <Text style={s.originalComment}>{originalComment}</Text>

        <Section style={s.reply}>
          <Text style={s.replyAuthor}>{commenterName} a répondu :</Text>
          <Text style={s.replyText}>{replyText}</Text>
        </Section>
      </Section>

      <Section style={s.btnSection}>
        <Button href={replyUrl} style={s.button}>
          Voir la discussion
        </Button>
      </Section>
    </EmailLayout>
  )
}

const s = {
  heading: {
    color: '#0f172a',
    fontSize: '22px',
    fontWeight: '700',
    lineHeight: '1.4',
    margin: '0 0 12px',
  },
  article: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0 0 20px',
  },
  threadBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px',
    margin: '0 0 24px',
  },
  threadLabel: {
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 6px',
    textTransform: 'uppercase' as const,
  },
  originalComment: {
    color: '#475569',
    fontSize: '14px',
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: '0 0 16px',
    paddingLeft: '12px',
    borderLeft: '2px solid #cbd5e1',
  },
  reply: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '12px',
  },
  replyAuthor: {
    color: '#0f172a',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 6px',
  },
  replyText: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
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
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px 28px',
    textDecoration: 'none',
  },
}

export default function Preview() {
  return (
    <CommentReplyEmail
      name="Jean Dupont"
      commenterName="Marie L."
      postTitle="GTO vs Exploitative : quelle approche choisir ?"
      originalComment="Je pense que le GTO pur n'a de sens qu'aux hauts stakes. En micro/small, exploiter les leaks est bien plus rentable."
      replyText="Entièrement d'accord ! Surtout que les adversaires en micro stakes ont des erreurs si massives que jouer GTO revient à laisser de la valeur sur la table."
      replyUrl="http://localhost:3000/blog/gto-vs-exploitative#comments"
    />
  )
}
