//in the real world, this would not be in the plugin
//but the logic here will be used in your main config / configs

import { map } from 'rxjs'
import { DocumentStore, SanityDocumentLike } from 'sanity'
import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { startCase } from 'lodash'

const getDocumentsByWorkflowState = (
  S: StructureBuilder,
  documentStore: DocumentStore,
  //could also add a document type filter if desired, etc.
  workflowState: string
) => {
  const query = `*[_type == 'workflow.metadata' && state == '${workflowState}']{
      'document': *[_id == "drafts." + ^.documentId]{_id,_type}[0]
    }[].document`

  return documentStore
    .listenQuery(
      //query for workflow metadata and get attached docs
      query,
      //params for query
      { workflowState },
      { throttleTime: 1000 }
    )
    .pipe(
      //@ts-ignore
      map((docs) => {
        return S.list()
          .title(startCase(workflowState))
          .items(
            docs.map((doc: SanityDocumentLike) => {
              return S.documentListItem().id(doc._id).schemaType(doc._type)
            })
          )
      })
    )
}

export const workflowMetadataDocumentStructure: StructureResolver = (
  S,
  { documentStore }
) => {
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
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'readyForRelease'
                  )
                ),
              S.listItem()
                .title('Ready for review')
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'readyForReview'
                  )
                ),
              S.divider(),
              S.documentTypeListItem('post').title('All posts'),
              S.listItem().title('Published').child(
                S.documentList()
                  .schemaType('post')
                  .title('Published')
                  .filter('_type == "post" && _publishedAt < now()')
                  //don't let people create new posts here
                  .initialValueTemplates([])
              ),
              S.listItem().title('Scheduled').child(
                S.documentTypeList('post')
                  .title('Scheduled')
                  .filter('_type == "post" && _publishedAt > now()')
                  //don't let people create new posts here
                  .initialValueTemplates([])
              ),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !omittedTypes.includes(item.getId())
      ),
    ])
}
