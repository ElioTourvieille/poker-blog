'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { BlockContent } from '@/sanity.types'

const components: PortableTextComponents = {
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
            className="rounded-xl w-full h-auto"
          />
          {value.caption && (
            <figcaption className="text-center font-ui text-xs text-outline mt-3 tracking-wide">
              {value.caption}
            </figcaption>
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
          className="underline underline-offset-2 text-primary hover:text-primary-container transition-colors"
        >
          {children}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="bg-surface-container px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-[17px] text-on-surface leading-[1.75] mb-6">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl font-semibold text-on-surface mt-12 mb-5 leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl font-semibold text-on-surface mt-10 mb-4 leading-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-xl font-medium text-on-surface mt-8 mb-3">{children}</h4>
    ),
    // Pull quote — the signature editorial component
    blockquote: ({ children }) => (
      <blockquote className="my-12 mx-auto max-w-lg text-center">
        <div className="w-12 h-px bg-secondary mx-auto mb-6" />
        <p className="font-serif text-2xl md:text-3xl font-medium text-on-surface leading-snug italic">
          {children}
        </p>
        <div className="w-12 h-px bg-secondary mx-auto mt-6" />
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-none pl-0 mb-6 space-y-3">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-3">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-sans text-[17px] text-on-surface leading-relaxed flex gap-3 before:content-['—'] before:text-secondary before:shrink-0">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="font-sans text-[17px] text-on-surface leading-relaxed">{children}</li>
    ),
  },
}

interface PortableTextRendererProps {
  value: BlockContent
  className?: string
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
