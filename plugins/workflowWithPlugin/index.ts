/*
 * using beta workflow plugin
 * same webhook for document metadata changes, but using people info
 */

import { definePlugin } from 'sanity'
import { workflow } from 'sanity-plugin-workflow'
import { deskTool } from 'sanity/desk'

export const workflowWithPlugin = definePlugin({
  name: 'workflow-with-plugin',
  plugins: [
    deskTool(),
    workflow({
      states: [
        { id: 'readyForReview', title: 'Ready For Review' },
        { id: 'readyForRelease', title: 'Ready For Release' },
      ],
      schemaTypes: ['post'],
    }),
  ],
})
