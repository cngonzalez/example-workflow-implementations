import { useCallback, useEffect, useState } from 'react'
import {
  DocumentActionProps,
  useCurrentUser,
  useDocumentOperation,
  userHasRole,
} from 'sanity'

export const ReviewAndPublish = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const user = useCurrentUser()
  const isAdmin =
    userHasRole(user, 'administrator') || userHasRole(user, 'editor')
  // const isAdmin = true

  const { patch, publish } = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [draft])

  /* remove the _readyForReview field and publish the document
   * this removes it from the "workflow"
   */
  const onHandle = async () => {
    if (draft) {
      patch.execute([{ unset: ['_readyForReview'] }], draft)
      publish.execute()
      onComplete()
    }
  }

  return {
    disabled: publish.disabled || !draft || !isAdmin,
    label: 'Review and Publish',
    onHandle,
  }
}
