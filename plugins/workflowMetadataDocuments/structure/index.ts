//in the real world, this would not be in the plugin
//but the logic here will be used in your main config / configs

import { map } from 'rxjs'
import { DocumentStore, SanityDocumentLike } from 'sanity'
import { StructureBuilder, StructureResolver } from 'sanity/desk'

const getDocumentsByWorkflowState = (
  S: StructureBuilder,
  documentStore: DocumentStore,
  //could also add a document type filter if desired, etc.
  workflowState: string
) => {
  const query = `*[_type == 'workflow.metadata' && state == '${workflowState}']{
      'document': coalesce(
        *[_id == "drafts." + ^.documentId]{_id,_type}[0],
        *[_id == ^.documentId]{_id,_type}[0]
      )
    }[].document`

  return documentStore
    .listenQuery(
      //query for workflow metadata and get attached docs
      query,
      //params for query
      { workflowState },
      //only listen for changes every second
      { throttleTime: 1000 }
    )
    .pipe(
      //@ts-expect-error
      map((docs) =>
        S.list()
          .title(workflowState)
          .items(
            docs.map((doc: SanityDocumentLike) => {
              return S.documentListItem().id(doc._id).schemaType(doc._type)
            })
          )
      )
    )
}

export const structure: StructureResolver = (S, { documentStore }) => {
  //dont show the workflow metadata documents in the desk
  const omittedTypes = ['workflow.metadata']
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Workflow')
        .child(
          S.list()
            .title('Workflow')
            .items([
              S.listItem()
                .title('Ready for release')
                .child(
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'readyForRelease'
                  )
                ),
              S.listItem()
                .title('Ready for review')
                .child(
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'readyForReview'
                  )
                ),
              //you could theoretically add a query for all documents that are not in a workflow state
              //but are drafts.
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !omittedTypes.includes(item.getId())
      ),
    ])
}
