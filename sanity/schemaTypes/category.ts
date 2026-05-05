import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
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
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {name: 'fr', type: 'text', title: 'Français'},
        {name: 'en', type: 'text', title: 'English'},
      ],
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for category badge (e.g., #2C5F4F)',
      validation: (Rule) => Rule.regex(/^#[0-9A-F]{6}$/i, {
        name: 'hex color',
        invert: false,
      }),
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
    },
  },
})