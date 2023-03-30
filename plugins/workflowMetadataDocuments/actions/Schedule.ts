import {useEffect} from 'react'
import {
  DocumentActionComponent,
  DocumentActionProps,
  useClient,
  useCurrentUser,
  userHasRole,
} from 'sanity'
import {useWorkflowMetadata} from '../utils/useWorkflowMetadata'

export function Schedule(scheduleAction: DocumentActionComponent) {
  const ScheduleWithWorkflow = (props: DocumentActionProps) => {
    const {id, draft} = props
    const {data, setState} = useWorkflowMetadata(id)
    const client = useClient({apiVersion: '2023-03-15'})

    const user = useCurrentUser()
    const isAdmin = user && (userHasRole(user, 'administrator') || userHasRole(user, 'editor'))

    // scheduled publishing sends window messages. listening to them
    // ensures we don't get into race conditions from onHandle et al.
    useEffect(() => {
      const scheduleMessages = ['scheduleDelete', 'scheduleCreate']
      const handleMessageEvent = async () => {
        const {projectId} = client.config()
        const schedule = await client
          .request({
            method: 'GET',
            uri: `/schedules/${projectId}/production`,
          })
          .then((scheduleData) =>
            scheduleData.schedules.find(
              (s: any) =>
                s.documents.find((doc: Record<string, any>) => doc.documentId === id) &&
                s.state === 'scheduled'
            )
          )
        if (schedule) {
          return setState('scheduled')
        }
        return setState('readyForRelease')
      }
      scheduleMessages.forEach((message) => {
        window.addEventListener(message, handleMessageEvent)
      })
      // cleanup listeners
      return () => {
        scheduleMessages.forEach((message) => {
          window.removeEventListener(message, handleMessageEvent)
        })
      }
    }, [client, id, setState])

    const originalResult = scheduleAction(props)

    // still show this if scheduled so we can reschedule
    if (!['readyForRelease', 'scheduled'].includes(data?.state as string) || !scheduleAction) {
      return null
    }

    return {
      ...originalResult,
      disabled: originalResult?.disabled || !isAdmin || !draft,
      label: 'Schedule and Change Metadata',
    }
  }
  return ScheduleWithWorkflow
}
