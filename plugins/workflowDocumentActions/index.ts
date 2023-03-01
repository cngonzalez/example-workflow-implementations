/*
 * features:
 * 1. hidden "readyForReview" boolean
 * 2. document action to set documents to "readyForReview" and notify
 * 3. document action (building on publish) to unset readyForReview
 * 4. (other option: use a webhook to notify and unset)
 */

import { definePlugin } from 'sanity'
import { deskTool } from 'sanity/desk'
import { actions } from './actions'
import { structure } from './structure'

export const workflowDocumentActions = definePlugin({
  name: 'workflow-document-actions',
  document: {
    //@ts-expect-error until disabled boolean resolved
    actions: actions,
  },
  plugins: [deskTool({ structure: structure })],
})
