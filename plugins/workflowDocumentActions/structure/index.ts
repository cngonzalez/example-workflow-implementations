import { StructureResolver } from 'sanity/desk'

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Ready for Review')
        //in other implementations, we can use document store
        .child(S.documentTypeList('post').filter('_readyForReview == true')),
      S.divider(),
      ...S.documentTypeListItems(),
    ])
}
