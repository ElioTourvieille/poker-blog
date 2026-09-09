'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { BlockContent } from '@/sanity.types'

type Tone = 'dark' | 'light'

function getComponents(tone: Tone): PortableTextComponents {
  const text = tone === 'light' ? 'text-plo-void' : 'text-plo-white'
  const muted = tone === 'light' ? 'text-plo-subtle' : 'text-plo-gray'

  return {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="my-10">
            <Image
              src={urlFor(value).width(880).url()}
              alt={value.alt ?? ''}
              width={880}
              height={550}
              className="w-full h-auto"
            />
            {value.caption && (
              <figcaption className={`text-center text-label mt-3 ${muted}`}>{value.caption}</figcaption>
            )}
          </figure>
        )
      },
    },
    marks: {
      link: ({ children, value }) => {
        const isExternal = value?.href?.startsWith('http')
        return (
          <a
            href={value?.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="underline underline-offset-2 text-plo-red hover:text-plo-red-hover transition-colors"
          >
            {children}
          </a>
        )
      },
      code: ({ children }) => (
        <code className={`px-1.5 py-0.5 text-sm font-mono ${tone === 'light' ? 'bg-plo-off' : 'bg-plo-surface'}`}>
          {children}
        </code>
      ),
    },
    block: {
      normal: ({ children }) => (
        <p className={`font-serif text-[18px] leading-[1.8] mb-6 ${text}`}>{children}</p>
      ),
      h2: ({ children }) => <h2 className={`font-ui text-3xl md:text-4xl mt-14 mb-5 ${text}`}>{children}</h2>,
      h3: ({ children }) => <h3 className={`font-ui text-2xl md:text-3xl mt-12 mb-4 ${text}`}>{children}</h3>,
      h4: ({ children }) => <h4 className={`font-ui text-xl md:text-2xl mt-10 mb-3 ${text}`}>{children}</h4>,
      // Pull quote — the signature editorial component
      blockquote: ({ children }) => (
        <blockquote className="my-12 mx-auto max-w-lg text-center">
          <div className="w-12 h-px bg-plo-red mx-auto mb-6" />
          <p className={`font-serif text-2xl md:text-3xl font-medium leading-snug italic ${text}`}>{children}</p>
          <div className="w-12 h-px bg-plo-red mx-auto mt-6" />
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-none pl-0 mb-6 space-y-3">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-3">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={`font-serif text-[18px] leading-relaxed flex gap-3 before:content-['—'] before:text-plo-red before:shrink-0 ${text}`}>
          {children}
        </li>
      ),
      number: ({ children }) => <li className={`font-serif text-[18px] leading-relaxed ${text}`}>{children}</li>,
    },
  }
}

interface PortableTextRendererProps {
  value: BlockContent
  className?: string
  /** 'light' pour un corps de texte sur fond blanc (page article), 'dark' ailleurs. */
  tone?: Tone
}

export function PortableTextRenderer({ value, className, tone = 'dark' }: PortableTextRendererProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={getComponents(tone)} />
    </div>
  )
}
