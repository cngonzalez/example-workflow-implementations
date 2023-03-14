import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, previewSecretId, projectId } from 'lib/sanity.api'
import { settingsPlugin, settingsStructure } from 'plugins/settings'
import { workflowDocumentActions } from 'plugins/workflowDocumentActions'
import { workflowMetadataDocuments } from 'plugins/workflowMetadataDocuments'
import { workflowWithPlugin } from 'plugins/workflowWithPlugin'
import { defineConfig, definePlugin } from 'sanity'
import { deskTool } from 'sanity/desk'
import {
  workflowMetadataDocumentStructure,
  workflowDocumentActionStructure,
} from './sanity/structure'
import authorType from 'schemas/author'
import postType from 'schemas/post'
import settingsType from 'schemas/settings'
import { scheduledPublishing } from '@sanity/scheduled-publishing'

/* ABOUT THIS FILE:
 * Each subsequent workspace represents a different, more complex pattern.
 * 1. First, we define the base configuration so we can inherit it in each workspace.
 * 2. Then, we'll implement each individual pattern in a separate workspace.
 * For more info, those patterns are also defined as plugins in the plugins folder.
 */

const basePlugin = definePlugin({
  name: 'baseConfig',
  schema: {
    types: [authorType, postType, settingsType],
  },
  plugins: [visionTool({ defaultApiVersion: apiVersion })],
})

export default defineConfig([
  {
    name: 'workflow-document-actions',
    basePath: '/studio/workflow-document-actions',
    projectId,
    dataset,
    title: 'Workflow document actions',
    plugins: [
      deskTool({ structure: workflowDocumentActionStructure }),
      basePlugin(),
      workflowDocumentActions(),
    ],
  },
  {
    name: 'workflow-metadata-documents',
    basePath: '/studio/workflow-metadata-documents',
    projectId,
    dataset,
    title: 'Workflow with Metadata Documents',
    plugins: [
      deskTool({ structure: workflowMetadataDocumentStructure }),
      basePlugin(),
      workflowMetadataDocuments(),
      scheduledPublishing(),
    ],
  },
  {
    name: 'workflow-plugin',
    basePath: '/studio/workflow-plugin',
    projectId,
    dataset,
    title: 'Workflow with plugin',
    plugins: [workflowWithPlugin(), basePlugin()],
  },
])
