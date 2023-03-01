import {
  DocumentActionProps,
  useClient,
  useCurrentUser,
  useDocumentOperation,
  userHasRole,
} from 'sanity'
import { useMetadataDocument } from '../utils/useMetadataDocument'

export const PublishAndDeleteMetadata = (props: DocumentActionProps) => {
  const { id, draft, onComplete, type } = props
  const { data, loading, error } = useMetadataDocument(id)
  const { publish } = useDocumentOperation(id, type)

  const user = useCurrentUser()
  const isAdmin =
    userHasRole(user, 'administrator') || userHasRole(user, 'editor')
  const client = useClient({ apiVersion: '2023-02-28' })

  const onHandle = async () => {
    //TODO: prove out a Slack ping here. We can even use the username!
    publish.execute()
    client.delete(`workflow-metadata.${id}`).then(() => onComplete())
  }

  //only show if we're ready for release
  if (data?.metadata?.state !== 'readyForRelease') {
    return null
  }
  console.log('publishing and deleting metadata', data)

  return {
    disabled: !draft || loading || error || publish.disabled || !isAdmin,
    label: 'Publish',
    onHandle,
  }
}
