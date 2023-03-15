import {
  DocumentActionProps,
  useCurrentUser,
  useValidationStatus,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const { data, setState } = useWorkflowMetadata(id)
  const { validation, isValidating } = useValidationStatus(id, type)
  const onHandle = async () => {
    setState('readyForReview')
    //and ping on Slack with the user we just grabbed!
    onComplete()
  }

  //don't put scheduled drafts back in the workflow
  if (
    data ||
    (draft?._publishedAt && draft._publishedAt > new Date().toISOString())
  ) {
    return null
  }

  return {
    disabled: !draft || isValidating || validation.length,
    label: 'Mark Ready For Review',
    onHandle,
  }
}
