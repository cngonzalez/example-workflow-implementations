import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { SetReadyForReview } from './SetReadyForReview'
import { ReviewAndPublish } from './ReviewAndPublish'

const WORKFLOW_DOCUMENT_TYPES = ['post']

export const actions = (
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
) => {
  const { schemaType } = context
  if (!WORKFLOW_DOCUMENT_TYPES.includes(schemaType)) {
    return prev
  }
  return [
    //for everyone, make the SetReadyForReview action "default" for drafts
    SetReadyForReview,
    ...prev.map((originalAction) => {
      //replace the publish action with the ReviewAndPublish action
      //this will be disabled for non-admins
      if (originalAction.action === 'publish') {
        return ReviewAndPublish
      }
      return originalAction
    }),
  ]
}
