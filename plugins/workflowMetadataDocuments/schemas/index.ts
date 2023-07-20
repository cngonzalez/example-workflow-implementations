import { SchemaTypeDefinition } from 'sanity'

export const workflowSchemas = (
  prev: SchemaTypeDefinition[],
): SchemaTypeDefinition[] => {
  return [
    ...prev,
    {
      type: 'document',
      name: 'workflow.metadata',
      title: 'Workflow metadata',
      fields: [
        { type: 'string', name: 'state', title: 'State' },
        { type: 'string', name: 'documentId', title: 'Document ID' },
        {
          type: 'array',
          name: 'assignees',
          title: 'Assignees',
          description:
            'The people who are assigned to move this further in the workflow.',
          of: [{ type: 'string' }],
        },
      ],
      liveEdit: true,
    },
  ]
}
