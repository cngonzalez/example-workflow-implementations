import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { Publish } from './Publish'
import { Schedule } from './Schedule'
import { SetReadyForRelease } from './SetReadyForRelease'
import { SetReadyForReview } from './SetReadyForReview'
import { ScheduleAction } from '@sanity/scheduled-publishing'

const WORKFLOW_DOCUMENT_TYPES = ['post', 'otherDocumentType']

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
    Schedule(scheduleAction),
    Publish(publishAction),
    // scheduleAction,
    ...prev.filter(
      (originalAction) =>
        //since we've manually replaced the order for user convenience, filter out the ones we've replaced
        !overriddenActions.includes(originalAction)
    ),
  ]
}
