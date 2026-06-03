import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email'
import * as React from 'react'

const SITE_NAME = 'PokerBlog'
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
  unsubscribeUrl?: string
}

export function EmailLayout({ preview, children, unsubscribeUrl }: EmailLayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>{SITE_NAME}</Text>
            <Text style={s.tagline}>Stratégie & Analyse Poker</Text>
          </Section>

          <Section style={s.content}>{children}</Section>

          <Hr style={s.hr} />
          <Section style={s.footer}>
            <Text style={s.footerText}>
              © {new Date().getFullYear()} {SITE_NAME}
            </Text>
            <Text style={s.footerText}>
              <Link href={`${SITE_URL}`} style={s.footerLink}>
                Visiter le site
              </Link>
              {unsubscribeUrl && (
                <>
                  {'  ·  '}
                  <Link href={unsubscribeUrl} style={s.footerLink}>
                    Se désabonner
                  </Link>
                </>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const s = {
  body: {
    backgroundColor: '#f0f4f8',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    margin: '0',
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    maxWidth: '580px',
    margin: '0 auto',
    overflow: 'hidden' as const,
  },
  header: {
    backgroundColor: '#0f172a',
    padding: '28px 32px 20px',
  },
  logo: {
    color: '#c9a84c',
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    margin: '0 0 2px',
  },
  tagline: {
    color: '#94a3b8',
    fontSize: '12px',
    letterSpacing: '0.5px',
    margin: '0',
    textTransform: 'uppercase' as const,
  },
  content: {
    padding: '32px',
  },
  hr: {
    borderColor: '#e2e8f0',
    margin: '0',
  },
  footer: {
    backgroundColor: '#f8fafc',
    padding: '20px 32px',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: '4px 0',
  },
  footerLink: {
    color: '#c9a84c',
    textDecoration: 'none',
  },
}
