import { DocumentActionProps, useValidationStatus } from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)
  const { validation, isValidating } = useValidationStatus(id, type)
  const onHandle = async () => {
    setState('readyForReview')
    onComplete()
  }

  //don't show if we're in the workflow
  if (data) {
    return null
  }

  return {
    disabled: !draft || isValidating || validation.length,
    label: 'Mark Ready For Review',
    onHandle,
  }
}
