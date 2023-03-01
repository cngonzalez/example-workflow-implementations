import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { PublishAndDeleteMetadata } from './PublishAndDeleteMetadata'
import { SetReadyForRelease } from './SetReadyForRelease'
import { SetReadyForReview } from './SetReadyForReview'

const WORKFLOW_DOCUMENT_TYPES = ['post']

export const actions = (
  prev: DocumentActionComponent[],
  context: DocumentActionsContext
) => {
  const { schemaType } = context

  if (!WORKFLOW_DOCUMENT_TYPES.includes(schemaType)) {
    return prev
  }

  return [
    SetReadyForReview,
    SetReadyForRelease,
    ...prev.map((originalAction) => {
      //replace the publish action with the ReviewAndPublish action
      //this will be disabled for non-admins
      if (originalAction.action === 'publish') {
        return PublishAndDeleteMetadata
      }
      return originalAction
    }),
  ]
}
