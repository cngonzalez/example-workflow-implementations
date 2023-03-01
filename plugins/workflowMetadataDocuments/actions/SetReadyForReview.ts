import { DocumentActionProps, useClient, useCurrentUser } from 'sanity'
import { useMetadataDocument } from '../utils/useMetadataDocument'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, draft, onComplete } = props
  const { data, loading, error } = useMetadataDocument(id)

  const user = useCurrentUser()
  const client = useClient({ apiVersion: '2023-02-28' })

  /* only create the metadata doc if there's a draft. 
    do nothing if there's no draft.  */
  const onHandle = async () => {
    //TODO: prove out a Slack ping here. We can even use the username!
    if (draft) {
      client.createIfNotExists(
        {
          _id: `workflow-metadata.${id}`,
          _type: `workflow.metadata`,
          documentId: id,
          state: 'readyForReview',
        },
        { visibility: 'async' }
      )
      onComplete()
    }
  }

  //only show this if we don't have metadata already
  //which means we're not in the workflow
  if (data?.metadata) {
    return null
  }

  return {
    disabled: !draft || loading || error,
    label: 'Mark Ready For Review',
    onHandle,
  }
}
