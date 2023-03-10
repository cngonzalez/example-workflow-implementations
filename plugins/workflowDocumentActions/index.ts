/*
 * features:
 * 1. hidden "readyForReview" boolean
 * 2. document action to set documents to "readyForReview" and notify
 * 3. document action (building on publish) to unset readyForReview
 * 4. (other option: use a webhook to notify and unset)
 */

import { definePlugin } from 'sanity'
import { actions } from './actions'

export const workflowDocumentActions = definePlugin({
  name: 'workflow-document-actions',
  document: {
    //@ts-expect-error until disabled boolean resolved
    actions: actions,
  },
})
