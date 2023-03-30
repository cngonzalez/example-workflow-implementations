import {DocumentActionComponent, DocumentActionProps, useCurrentUser, userHasRole, useValidationStatus} from 'sanity'
import {useWorkflowMetadata} from '../utils/useWorkflowMetadata'

export function Publish(publishAction: DocumentActionComponent) {
  const PublishActionWithWorkflow = (props: DocumentActionProps) => {
    const {id, draft, type} = props
    const {data} = useWorkflowMetadata(id)
    const { validation, isValidating } = useValidationStatus(id, type)

    const user = useCurrentUser()
    const isAdmin = user && (userHasRole(user, 'administrator') || userHasRole(user, 'editor'))
    const originalResult = publishAction(props)

    // only show if we're ready for release
    if (data?.state !== 'readyForRelease') {
      return null
    }

    return {
      ...originalResult,
      disabled: !draft || originalResult?.disabled || !isAdmin || isValidating || validation.length,
    }
  }
  return PublishActionWithWorkflow
}
