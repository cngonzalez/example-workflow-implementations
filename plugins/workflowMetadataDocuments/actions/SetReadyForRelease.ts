import {
  DocumentActionProps,
  useCurrentUser,
  userHasRole,
  useValidationStatus,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForRelease = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)
  const { validation, isValidating } = useValidationStatus(id, type)
  const user = useCurrentUser()
  const isAdmin =
    userHasRole(user, 'administrator') || userHasRole(user, 'editor')

  const onHandle = async () => {
    setState('readyForRelease')
    onComplete()
  }

  //only show this if we have metadata showing we're in the workflow
  if (data?.state !== 'readyForReview') {
    return null
  }

  return {
    disabled: !draft || isValidating || validation.length || !isAdmin,
    label: 'Mark Ready For Release',
    onHandle,
  }
}
