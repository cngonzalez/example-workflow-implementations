import { useState } from 'react'
import { DocumentActionProps, useDocumentOperation } from 'sanity'
import { Button } from '@sanity/ui'

export const SetReadyForReview = (props: DocumentActionProps) => {
  const { id, type, draft, onComplete } = props
  const { patch, unpublish } = useDocumentOperation(id, type)
  const [dialogOpen, setDialogOpen] = useState(false)

  /* only patch the draft. do nothing if there's no draft.  */
  const onHandle = async () => {
    setDialogOpen(true)
  }

  const onClick = () => {
    if (draft) {
      patch.execute([{ set: { _readyForReview: true } }], draft)
      //unpublish.execute()
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
    dialog: dialogOpen && {
      type: 'modal',
      onClose: () => setDialogOpen(false),
      title: 'Mark Ready For Review',
      content: (
        <div>
          <p>Are you sure you want to mark this document ready for review?</p>
          <Button onClick={onClick}>Yes</Button>
        </div>
      ),
    },
  }
}
