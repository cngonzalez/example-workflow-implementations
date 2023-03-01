import {
  DocumentActionProps,
  useCurrentUser,
  useDocumentOperation,
} from 'sanity'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const user = useCurrentUser()
  const { patch } = useDocumentOperation(id, type)

  /* only patch the draft. do nothing if there's no draft.  */
  const onHandle = async () => {
    if (draft) {
      //TODO: prove out a Slack ping here. We can even use the username!
      //alternatively, totally fine to use a webhook.
      //that definition will look something like:
      patch.execute([{ set: { _readyForReview: true } }], draft)
      onComplete()
    }
  }

  if (draft && draft._readyForReview) {
    return null
  }

  return {
    disabled: !draft,
    label: 'Mark Ready For Review',
    onHandle,
  }
}
