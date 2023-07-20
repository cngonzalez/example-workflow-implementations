//in the real world, this would not be in the plugin
//but the logic here will be used in your main config / configs

import { map } from 'rxjs'
import { DocumentStore, SanityDocumentLike } from 'sanity'
import { StructureBuilder, StructureResolver } from 'sanity/desk'
import { startCase } from 'lodash'

const getDocumentsByWorkflowState = (
  S: StructureBuilder,
  documentStore: DocumentStore,
  documentType: string,
  workflowState: string,
) => {
  const query = `*[_type == 'workflow.metadata' && state == '${workflowState}']{
      'document': *[_id == 'drafts.' + ^.documentId && _type == '${documentType}']{_id,_type}[0]
    }[].document`

  return documentStore
    .listenQuery(
      //query for workflow metadata and get attached docs
      query,
      //params for query
      {},
      { throttleTime: 1000 },
    )
    .pipe(
      //@ts-ignore
      map((docs) => {
        return S.list()
          .title(startCase(workflowState))
          .items(
            docs.filter(Boolean).map((doc: SanityDocumentLike) => {
              return S.documentListItem().id(doc._id).schemaType(documentType)
            }),
          )
      }),
    )
}

export const workflowMetadataDocumentStructure: StructureResolver = (
  S,
  { documentStore },
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
              S.documentTypeListItem('post').title('All posts'),
              S.divider(),
              S.listItem()
                .title('Posts ready for release')
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'post',
                    'readyForRelease',
                  ),
                ),
              S.listItem()
                .title('Posts ready for review')
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'post',
                    'readyForReview',
                  ),
                ),
              S.divider(),
              S.listItem()
                .title('Unpublished')
                .child(
                  S.documentList()
                    .schemaType('post')
                    .title('Unpublished')
                    .filter('_type == "post" && !defined(_publishedAt)'),
                ),
              S.listItem().title('Published').child(
                S.documentList()
                  .schemaType('post')
                  .title('Published')
                  .filter('_type == "post" && defined(_publishedAt)')
                  //don't let people create new posts here
                  .initialValueTemplates([]),
              ),
              S.listItem()
                .title('Scheduled posts')
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'post',
                    'scheduled',
                  ),
                ),
              S.listItem()
                .title('Scheduled other type')
                .child(() =>
                  getDocumentsByWorkflowState(
                    S,
                    documentStore,
                    'otherDocumentType',
                    'scheduled',
                  ),
                ),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !omittedTypes.includes(item.getId()),
      ),
    ])
}
