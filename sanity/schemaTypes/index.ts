import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import category from './category'
import author from './author'
import blockContent from './blockContent'
import tag from './tag'
import siteSettings from './siteSettings'
import page from './page'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    category,
    author,
    blockContent,
    tag,
    siteSettings,
    page,
  ],
}