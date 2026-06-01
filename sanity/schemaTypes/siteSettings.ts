import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'object',
      fields: [
        {name: 'fr', type: 'text', title: 'Français', rows: 3},
        {name: 'en', type: 'text', title: 'English', rows: 3},
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'twitter', type: 'url', title: 'Twitter / X'},
        {name: 'instagram', type: 'url', title: 'Instagram'},
        {name: 'youtube', type: 'url', title: 'YouTube'},
        {name: 'twitch', type: 'url', title: 'Twitch'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
