import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { PublishAndDeleteMetadata } from './PublishAndDeleteMetadata'
import { ScheduleAndDeleteMetadata } from './ScheduleAndDeleteMetadata'
import { SetReadyForRelease } from './SetReadyForRelease'
import { SetReadyForReview } from './SetReadyForReview'
import { ScheduleAction } from '@sanity/scheduled-publishing'

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
  const scheduleAction = prev.find((action) => action === ScheduleAction)
  const overriddenActions = [publishAction, scheduleAction].filter(Boolean)

  return [
    SetReadyForReview,
    SetReadyForRelease,
    ScheduleAndDeleteMetadata(scheduleAction),
    PublishAndDeleteMetadata(publishAction),
    //this usually won't show up as the default action, but if it does, it will be disabled
    //for contributors, but available for admins who need to push a quick fix
    publishAction,
    // scheduleAction,
    ...prev.filter(
      (originalAction) =>
        //since we've manually replaced the order for user convenience, filter out the ones we've replaced
        !overriddenActions.includes(originalAction)
    ),
  ]
}
