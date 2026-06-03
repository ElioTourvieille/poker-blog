import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

// ─── Better Auth tables ───────────────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  // Auth custom fields
  role: text('role', { enum: ['user', 'admin', 'premium'] }).notNull().default('user'),
  isPremium: boolean('is_premium').notNull().default(false),
  // Stripe (set via webhook, not during auth)
  stripeCustomerId: text('stripe_customer_id'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// ─── App tables ───────────────────────────────────────────────────────────────

export const comment = pgTable('comment', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  postSlug: text('post_slug').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const like = pgTable('like', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  postSlug: text('post_slug').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.postSlug] }),
])

export const bookmark = pgTable('bookmark', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  postSlug: text('post_slug').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.postSlug] }),
])

export const newsletterSubscriber = pgTable('newsletter_subscriber', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  locale: text('locale', { enum: ['fr', 'en'] }).notNull().default('fr'),
  isConfirmed: boolean('is_confirmed').notNull().default(false),
  confirmedAt: timestamp('confirmed_at'),
  lists: text('lists').array().notNull().default(['GENERAL']),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const handSubmission = pgTable('hand_submission', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  board: text('board').notNull(),
  heroCards: text('hero_cards').notNull(),
  situation: text('situation').notNull(),
  reasoning: text('reasoning'),
  action: text('action').notNull(),
  status: text('status', { enum: ['PENDING', 'APPROVED', 'REJECTED'] }).notNull().default('PENDING'),
  rejectionNote: text('rejection_note'),
  publishedHandId: text('published_hand_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reputation = pgTable('reputation', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
  points: integer('points').notNull().default(0),
  badges: text('badges').array().notNull().default([]),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
