import {
  DocumentActionComponent,
  DocumentActionProps,
  useCurrentUser,
  userHasRole,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const Publish = (publishAction: DocumentActionComponent) => {
  return (props: DocumentActionProps) => {
    const { id, draft } = props
    const { data } = useWorkflowMetadata(id)

    const user = useCurrentUser()
    const isAdmin =
      userHasRole(user, 'administrator') || userHasRole(user, 'editor')
    const originalResult = publishAction(props)

    //only show if we're ready for release
    if (data?.state !== 'readyForRelease') {
      return null
    }

    return {
      ...originalResult,
      disabled: !draft || originalResult.disabled || !isAdmin,
    }
  }
}
