import {
  DocumentActionProps,
  useCurrentUser,
  useValidationStatus,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForRelease = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)
  const { validation, isValidating } = useValidationStatus(id, type)

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
    disabled: !draft || isValidating || validation.length,
    label: 'Mark Ready For Release',
    onHandle,
  }
}
