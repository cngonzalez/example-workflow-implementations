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

  const publishAction = prev.find((action) => action.action === 'publish')

  return [
    SetReadyForReview,
    SetReadyForRelease,
    PublishAndDeleteMetadata,
    //this usually won't show up as the default action, but if it does, it will be disabled
    //for contributors, but available for admins who need to push a quick fix
    publishAction,
    ...prev.filter(
      (originalAction) =>
        //replace the publish action with the ReviewAndPublish action
        //this will be disabled for non-admins
        originalAction.action !== 'publish'
    ),
  ]
}
