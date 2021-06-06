import get from 'lodash.get'
import isNil from 'lodash.isnil'

import createFileApi from './createFileApi'

const getDefaultCommitMessage = (action, contentTypeName) => `${action} ${contentTypeName} - Safis CMS`

const getContent = (fileApi) => async ({ owner, repo, path, branch }) => {
  const fileContent = await fileApi.getContent({
    owner,
    repo,
    path,
    branch,
  })

  if (isNil(fileContent)) return null

  return JSON.parse(fileContent)
}

const getFolderContent = (fileApi) => async ({ owner, repo, path, branch }) => {
  const filesContent = await fileApi.getFolderContent({
    owner,
    repo,
    path,
    branch,
  })

  return filesContent.reduce((filtered, entry) => {
    const content = get(entry, 'object.text')

    if (!isNil(content)) {
      filtered.push(JSON.parse(content))
    }

    return filtered
  }, [])
}

const createContent = (fileApi, { contentTypeName }) => async ({
  owner,
  repo,
  branch,
  path,
  content,
  commitMessage = getDefaultCommitMessage('Add', contentTypeName),
}) => {
  const fileContent = await fileApi.getContent({
    owner,
    repo,
    path,
    branch,
  })

  if (!isNil(fileContent)) throw new Error(`${contentTypeName} already exists.`)

  await fileApi.createContent({
    repo,
    owner,
    branch,
    files: {
      content: JSON.stringify(content),
      path,
    },
    commitMessage,
  })

  return content
}

const updateContent = (fileApi, { contentTypeName }) => async ({
  owner,
  repo,
  branch,
  path,
  content: newContent,
  commitMessage = getDefaultCommitMessage('Update', contentTypeName),
}) => {
  const fileContent = await fileApi.getContent({
    owner,
    repo,
    path,
    branch,
  })

  if (isNil(fileContent)) throw new Error(`${contentTypeName} not found.`)

  const parsedExistingContent = JSON.parse(fileContent)

  const mergedContent = {
    ...parsedExistingContent,
    ...newContent,
  }

  await fileApi.createContent({
    repo,
    owner,
    branch,
    files: {
      content: JSON.stringify(mergedContent),
      path,
    },
    commitMessage,
  })

  return mergedContent
}

const deleteContent = (fileApi, { contentTypeName }) => async ({
  owner,
  repo,
  branch,
  path,
  commitMessage = getDefaultCommitMessage('Delete', contentTypeName),
}) => {
  const fileContent = await fileApi.getContent({
    owner,
    repo,
    path,
    branch,
  })

  if (isNil(fileContent)) throw new Error(`${contentTypeName} not found.`)

  await fileApi.deleteContent({
    repo,
    owner,
    branch,
    path,
    commitMessage,
  })

  return true
}

export default ({ contentTypeName = 'File' } = {}) => (client) => {
  const fileApi = createFileApi(client)

  return {
    create: createContent(fileApi, { contentTypeName }),
    delete: deleteContent(fileApi, { contentTypeName }),
    get: getContent(fileApi, { contentTypeName }),
    getAll: getFolderContent(fileApi, { contentTypeName }),
    update: updateContent(fileApi, { contentTypeName }),
  }
}
