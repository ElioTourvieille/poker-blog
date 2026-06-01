'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // TODO: wire up to an email service (Resend, SendGrid, etc.)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-6 text-center">
        <p className="text-green-700 dark:text-green-300 font-medium">{t('success')}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('title')}</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t('name')}
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t('message')}
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={t('messagePlaceholder')}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-2.5 font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? t('sending') : t('send')}
        </button>
      </form>
    </div>
  )
}
