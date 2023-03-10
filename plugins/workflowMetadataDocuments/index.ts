/*
 * features:
 * 1. use of metadata documents
 * 2. document action to create metadata document and notify
 * 3. document action to move to "readyForRelease" and notify.
 *    role to determine that nothing in "readyForRelease" can be changed?
 * 4. document action (building on publish) to delete metadata doc
 */

import { definePlugin } from 'sanity'
import { actions } from './actions'
import { workflowSchemas } from './schemas'

export const workflowMetadataDocuments = definePlugin({
  name: 'workflow-metadata-documents',
  document: {
    //@ts-expect-error until disabled boolean resolved
    actions: actions,
  },
  schema: {
    types: workflowSchemas,
  },
})
