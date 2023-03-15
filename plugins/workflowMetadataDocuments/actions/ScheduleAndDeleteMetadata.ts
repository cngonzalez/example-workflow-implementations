import { useEffect, useMemo, useState } from 'react'
import {
  DateInput,
  DocumentActionComponent,
  DocumentActionProps,
  useClient,
  useCurrentUser,
  useDocumentOperation,
  userHasRole,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const ScheduleAndDeleteMetadata = (
  scheduleAction: DocumentActionComponent
) => {
  return (props: DocumentActionProps) => {
    const { id, type, draft } = props
    const { data, deleteMetadata, setState } = useWorkflowMetadata(id)
    const { patch } = useDocumentOperation(id, type)
    const client = useClient({ apiVersion: '2023-03-15' })

    const user = useCurrentUser()
    const isAdmin =
      userHasRole(user, 'administrator') || userHasRole(user, 'editor')
    const originalResult = scheduleAction(props)

    //scheduled publishing sends window messages. listening to them
    //ensures we don't get into race conditions from onHandle et al.
    useEffect(() => {
      const scheduleMessages = [
        'scheduleDelete',
        'scheduleUpdate',
        'scheduleCreate',
      ]
      const handleMessageEvent = async (event: MessageEvent) => {
        if (event.type === 'scheduleDelete') {
          patch.execute([{ unset: ['_publishedAt'] }], { _id: id })
          //there's no more schedule, send doc back to its previous state
          //or to beginning of workflow if needed
          return setState('readyForRelease')
        }
        const projectId = client.config().projectId
        const schedule = await client
          .request({
            method: 'GET',
            uri: `/schedules/${projectId}/production`,
          })
          .then((data) =>
            data.schedules.find((s: any) =>
              s.documents.find((doc) => doc.documentId === id)
            )
          )
        if (schedule) {
          patch.execute([{ set: { _publishedAt: schedule.executeAt } }], {
            _id: id,
          })
          return deleteMetadata()
        }
      }
      scheduleMessages.forEach((message) => {
        window.addEventListener(message, handleMessageEvent)
      })
      //cleanup listeners
      return () => {
        scheduleMessages.forEach((message) => {
          window.removeEventListener(message, handleMessageEvent)
        })
      }
    }, [patch, client, id, setState, deleteMetadata])

    //still show this if no workflow so we can resched
    if (data && data?.state !== 'readyForRelease') {
      return null
    }

    return {
      ...originalResult,
      disabled: originalResult.disabled || !isAdmin || !draft,
      label: 'Schedule and Update Metadata',
    }
  }
}
