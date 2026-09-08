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
      <div className="border border-plo-border p-8 text-center">
        <p className="text-display text-2xl text-plo-white">{t('success')}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-display text-4xl md:text-5xl text-plo-white mb-3">{t('title')}</h1>
      <p className="font-sans text-plo-gray mb-10">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-label text-plo-gray">
            {t('name')}
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className="input-newsletter input-newsletter-dark"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-label text-plo-gray">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            className="input-newsletter input-newsletter-dark"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-label text-plo-gray">
            {t('message')}
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={t('messagePlaceholder')}
            className="input-newsletter input-newsletter-dark resize-none"
          />
        </div>

        <button type="submit" disabled={status === 'sending'} className="btn-primary self-start disabled:opacity-60">
          {status === 'sending' ? t('sending') : t('send')}
        </button>
      </form>
    </div>
  )
}
