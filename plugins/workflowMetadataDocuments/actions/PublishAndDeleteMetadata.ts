import {
  DocumentActionProps,
  useCurrentUser,
  useDocumentOperation,
  userHasRole,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const PublishAndDeleteMetadata = (props: DocumentActionProps) => {
  const { id, draft, onComplete, type } = props
  const { data, deleteMetadata } = useWorkflowMetadata(id)
  const { publish } = useDocumentOperation(id, type)

  const user = useCurrentUser()
  const isAdmin =
    userHasRole(user, 'administrator') || userHasRole(user, 'editor')

  const onHandle = async () => {
    if (publish.disabled) {
      onComplete()
      return
    }
    //TODO: prove out a Slack ping here. We can even use the username!
    publish.execute()
    deleteMetadata()
    onComplete()
  }

  //only show if we're ready for release
  if (data?.state !== 'readyForRelease') {
    return null
  }

  return {
    disabled: !draft || publish.disabled || !isAdmin,
    label: 'Publish',
    onHandle,
  }
}
