import { DocumentActionProps, useCurrentUser } from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)

  const user = useCurrentUser()

  const onHandle = async () => {
    setState('readyForReview')
    //and ping on Slack with the user we just grabbed!
    onComplete()
  }

  if (!draft || data) {
    return null
  }

  return {
    disabled: !draft,
    label: 'Mark Ready For Review',
    onHandle,
  }
}
