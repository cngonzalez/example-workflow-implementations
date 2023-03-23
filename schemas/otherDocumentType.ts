import { defineType } from 'sanity'

export default defineType({
  name: 'otherDocumentType',
  title: 'Other Document Type',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
  ],
})
