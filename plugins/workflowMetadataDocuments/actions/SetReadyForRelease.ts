import { DocumentActionProps, useClient, useCurrentUser } from 'sanity'
import { useMetadataDocument } from '../utils/useMetadataDocument'

export const SetReadyForRelease = (props: DocumentActionProps) => {
  const { id, draft, onComplete } = props
  const { data, loading, error } = useMetadataDocument(id)

  const user = useCurrentUser()
  const client = useClient({ apiVersion: '2023-02-28' })

  const onHandle = async () => {
    //TODO: prove out a Slack ping here. We can even use the username!
    client
      .patch(`workflow-metadata.${id}`)
      .set({ state: 'readyForRelease' })
      .commit({ visibility: 'async' })
      .then(() => onComplete())
  }

  //only show this if we have metadata showing we're in the workflow
  if (data?.metadata?.state !== 'readyForReview') {
    return null
  }

  return {
    //add whatever admin rules make sense here
    disabled: !draft || loading || error,
    label: 'Mark Ready For Release',
    onHandle,
  }
}
