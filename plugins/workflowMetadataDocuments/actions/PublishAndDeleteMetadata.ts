import {
  DocumentActionComponent,
  DocumentActionProps,
  useCurrentUser,
  useDocumentOperation,
  userHasRole,
} from 'sanity'
import { useWorkflowMetadata } from '../utils/useWorkflowMetadata'

export const PublishAndDeleteMetadata = (
  publishAction: DocumentActionComponent
) => {
  return (props: DocumentActionProps) => {
    const { id, type } = props
    const { data, deleteMetadata } = useWorkflowMetadata(id)
    const { patch } = useDocumentOperation(id, type)

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
      disabled: originalResult.disabled || !isAdmin,
      label: 'Publish and Delete Metadata',
      onHandle: () => {
        originalResult.onHandle()
        patch.execute([{ set: { _publishedAt: new Date().toISOString() } }], {
          _id: id,
        })
        deleteMetadata()
      },
    }
  }
}
