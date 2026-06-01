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
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt ?? ''}
            width={800}
            height={500}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-zinc-500 mt-2">{value.caption}</figcaption>
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
          className="underline text-blue-600 dark:text-blue-400 hover:opacity-80"
        >
          {children}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    normal: ({ children }) => <p className="mb-5 leading-7 text-zinc-700 dark:text-zinc-300">{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-zinc-900 dark:text-zinc-50">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-zinc-900 dark:text-zinc-50">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-zinc-900 dark:text-zinc-50">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-5 italic text-zinc-600 dark:text-zinc-400 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-1.5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-1.5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7 text-zinc-700 dark:text-zinc-300">{children}</li>,
    number: ({ children }) => <li className="leading-7 text-zinc-700 dark:text-zinc-300">{children}</li>,
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
