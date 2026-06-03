import { render } from 'react-email'
import { resend, FROM_EMAIL } from './resend'
import { MagicLinkEmail } from '@/emails/auth/MagicLinkEmail'
import { WelcomeEmail } from '@/emails/welcome/WelcomeEmail'
import { NewsletterConfirmEmail } from '@/emails/newsletter/NewsletterConfirmEmail'
import { WeeklyDigestEmail, type DigestPost } from '@/emails/digest/WeeklyDigestEmail'
import { HandOfWeekEmail } from '@/emails/hand/HandOfWeekEmail'
import { HandAnalysisRevealEmail } from '@/emails/hand/HandAnalysisRevealEmail'
import { HandSelectedEmail } from '@/emails/hand/HandSelectedEmail'
import { HandRejectedEmail } from '@/emails/hand/HandRejectedEmail'
import { CommentReplyEmail } from '@/emails/comments/CommentReplyEmail'
import { PremiumWelcomeEmail } from '@/emails/premium/PremiumWelcomeEmail'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  const html = await render(<MagicLinkEmail email={email} url={url} />)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Votre lien de connexion PokerBlog',
    html,
  })
  if (error) throw new Error(`[mailer] sendMagicLinkEmail: ${error.message}`)
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const html = await render(<WelcomeEmail name={name} />)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Bienvenue sur PokerBlog !',
    html,
  })
  if (error) console.error(`[mailer] sendWelcomeEmail: ${error.message}`)
}

export async function sendPremiumWelcomeEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const html = await render(<PremiumWelcomeEmail name={name} />)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Bienvenue dans PokerBlog Premium !',
    html,
  })
  if (error) console.error(`[mailer] sendPremiumWelcomeEmail: ${error.message}`)
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function sendNewsletterConfirmEmail({
  email,
  confirmUrl,
  locale = 'fr',
}: {
  email: string
  confirmUrl: string
  locale?: 'fr' | 'en'
}) {
  const html = await render(
    <NewsletterConfirmEmail confirmUrl={confirmUrl} locale={locale} />
  )
  const subject =
    locale === 'en'
      ? 'Confirm your PokerBlog newsletter subscription'
      : 'Confirmez votre inscription à la newsletter PokerBlog'
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    html,
  })
  if (error) console.error(`[mailer] sendNewsletterConfirmEmail: ${error.message}`)
}

export async function sendWeeklyDigestEmail({
  name,
  email,
  posts,
  weekLabel,
  unsubscribeUrl,
}: {
  name: string
  email: string
  posts: DigestPost[]
  weekLabel?: string
  unsubscribeUrl?: string
}) {
  const html = await render(
    <WeeklyDigestEmail name={name} posts={posts} weekLabel={weekLabel} unsubscribeUrl={unsubscribeUrl} />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `PokerBlog — Votre résumé de la semaine (${posts.length} articles)`,
    html,
  })
  if (error) console.error(`[mailer] sendWeeklyDigestEmail: ${error.message}`)
}

// ─── Main de la semaine ───────────────────────────────────────────────────────

export async function sendHandOfWeekEmail({
  name,
  email,
  voteUrl,
  deadline,
  situation,
}: {
  name: string
  email: string
  voteUrl: string
  deadline: string
  situation?: string
}) {
  const html = await render(
    <HandOfWeekEmail
      name={name}
      voteUrl={voteUrl}
      deadline={deadline}
      situation={situation}
    />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Nouvelle main disponible — votez maintenant !',
    html,
  })
  if (error) console.error(`[mailer] sendHandOfWeekEmail: ${error.message}`)
}

export async function sendHandAnalysisRevealEmail({
  name,
  email,
  analysisUrl,
  situation,
}: {
  name: string
  email: string
  analysisUrl: string
  situation?: string
}) {
  const html = await render(
    <HandAnalysisRevealEmail
      name={name}
      analysisUrl={analysisUrl}
      situation={situation}
    />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "PokerBlog — L'analyse de la Main de la semaine est publiée !",
    html,
  })
  if (error) console.error(`[mailer] sendHandAnalysisRevealEmail: ${error.message}`)
}

export async function sendHandSelectedEmail({
  name,
  email,
  publishUrl,
  board,
  situation,
}: {
  name: string
  email: string
  publishUrl: string
  board?: string
  situation?: string
}) {
  const html = await render(
    <HandSelectedEmail
      name={name}
      publishUrl={publishUrl}
      board={board}
      situation={situation}
    />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Votre main a été sélectionnée comme Main de la semaine !',
    html,
  })
  if (error) console.error(`[mailer] sendHandSelectedEmail: ${error.message}`)
}

export async function sendHandRejectedEmail({
  name,
  email,
  rejectionNote,
}: {
  name: string
  email: string
  rejectionNote?: string
}) {
  const html = await render(
    <HandRejectedEmail name={name} rejectionNote={rejectionNote} />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Mise à jour concernant votre soumission de main',
    html,
  })
  if (error) console.error(`[mailer] sendHandRejectedEmail: ${error.message}`)
}

// ─── Commentaires ─────────────────────────────────────────────────────────────

export async function sendCommentReplyEmail({
  name,
  email,
  commenterName,
  originalComment,
  replyText,
  replyUrl,
  postTitle,
}: {
  name: string
  email: string
  commenterName: string
  originalComment: string
  replyText: string
  replyUrl: string
  postTitle: string
}) {
  const html = await render(
    <CommentReplyEmail
      name={name}
      commenterName={commenterName}
      originalComment={originalComment}
      replyText={replyText}
      replyUrl={replyUrl}
      postTitle={postTitle}
    />
  )
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${commenterName} a répondu à votre commentaire`,
    html,
  })
  if (error) console.error(`[mailer] sendCommentReplyEmail: ${error.message}`)
}
