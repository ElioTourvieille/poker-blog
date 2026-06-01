import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {name: 'fr', type: 'string', title: 'Français'},
        {name: 'en', type: 'string', title: 'English'},
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.fr',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        {name: 'fr', type: 'blockContent', title: 'Français'},
        {name: 'en', type: 'blockContent', title: 'English'},
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {name: 'metaTitle', type: 'string', title: 'Meta Title'},
        {name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 3},
        {name: 'ogImage', type: 'image', title: 'OG Image'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
    },
  },
})
