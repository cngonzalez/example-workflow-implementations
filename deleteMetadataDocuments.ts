import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-02-15' })

client.delete({ query: `*[_type == 'workflow.metadata']` })

//delete all non-draft articles
client.delete({ query: `*[_type == 'post' && !(_id in path('drafts.**'))]` })
