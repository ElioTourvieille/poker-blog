import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(1000),
  postSlug: z.string().min(1),
})

export const toggleLikeSchema = z.object({
  postSlug: z.string().min(1),
})

export const toggleBookmarkSchema = z.object({
  postSlug: z.string().min(1),
})

export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Email invalide'),
  locale: z.enum(['fr', 'en']).default('fr'),
  lists: z.array(z.enum(['GENERAL', 'HAND_OF_WEEK'])).default(['GENERAL']),
})

export const createHandSubmissionSchema = z.object({
  board: z.string().min(1).max(500, 'Board trop long'),
  heroCards: z.string().min(2).max(10, 'Format invalide (ex: AhKd)'),
  situation: z.string().min(20, 'Décris la situation en détail').max(2000),
  reasoning: z.string().max(2000).optional(),
  action: z.string().min(1).max(500),
})

// ─── Modération ─────────────────────────────────────────────────────────────

export const moderateCommentSchema = z.object({
  isApproved: z.literal(true),
})

export const moderateHandSubmissionSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('APPROVED'),
    publishUrl: z.string().url('URL invalide').optional(),
    publishedHandId: z.string().min(1).optional(),
  }),
  z.object({
    status: z.literal('REJECTED'),
    rejectionNote: z.string().min(1).max(1000).optional(),
  }),
])
