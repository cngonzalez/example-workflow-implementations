import { DocumentActionProps, useCurrentUser } from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForRelease = (props: DocumentActionProps) => {
  const { id, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)

  const user = useCurrentUser()

  const onHandle = async () => {
    //TODO: prove out a Slack ping here. We can even use the username!
    setState('readyForRelease')
    onComplete()
  }

  //only show this if we have metadata showing we're in the workflow
  if (data?.state !== 'readyForReview') {
    return null
  }

  return {
    disabled: !draft,
    label: 'Mark Ready For Release',
    onHandle,
  }
}
