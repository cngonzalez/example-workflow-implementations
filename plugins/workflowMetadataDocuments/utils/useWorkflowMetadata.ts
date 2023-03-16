import { useDocumentOperation, useEditState } from 'sanity'

export function useWorkflowMetadata(id: string) {
  const editState = useEditState(`workflow-metadata.${id}`, 'workflow.metadata')
  const ops = useDocumentOperation(
    `workflow-metadata.${id}`,
    'workflow.metadata'
  )

  //check if metadata exists. if not, return null
  const data =
    editState && editState.published ? editState.published : undefined

  return {
    data,
    setState,
  }

  //this will create the doc for us if it doesn't exist, and also set the state we need
  function setState(state: string) {
    ops.patch.execute(
      [{ setIfMissing: { documentId: id } }, { set: { state: `${state}` } }],
      { _id: id }
    )
  }
}
