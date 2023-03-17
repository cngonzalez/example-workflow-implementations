import { useEffect } from 'react'
import {
  DateInput,
  DocumentActionComponent,
  DocumentActionProps,
  useClient,
  useCurrentUser,
  userHasRole,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const Schedule = (scheduleAction: DocumentActionComponent) => {
  return (props: DocumentActionProps) => {
    const { id, draft } = props
    const { data, setState } = useWorkflowMetadata(id)
    const client = useClient({ apiVersion: '2023-03-15' })

    const user = useCurrentUser()
    const isAdmin =
      userHasRole(user, 'administrator') || userHasRole(user, 'editor')
    const originalResult = scheduleAction(props)

    //scheduled publishing sends window messages. listening to them
    //ensures we don't get into race conditions from onHandle et al.
    useEffect(() => {
      const scheduleMessages = ['scheduleDelete', 'scheduleCreate']
      const handleMessageEvent = async (event: MessageEvent) => {
        if (event.type === 'scheduleDelete') {
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
          return setState('scheduled')
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
    }, [client, id, setState])

    //still show this if scheduled so we can reschedule
    if (!['readyForRelease', 'scheduled'].includes(data?.state as string)) {
      return null
    }

    return {
      ...originalResult,
      disabled: originalResult.disabled || !isAdmin || !draft,
      label: 'Schedule and Update Metadata',
    }
  }
}
