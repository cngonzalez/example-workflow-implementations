import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-02-15' })

client.delete({ query: `*[_type == 'workflow.metadata']` })
