import get from 'lodash.get'

import { fileModes, itemTypes, errors } from '../constants'

const TYPENAME_BLOB = 'Blob' // used to compare against GraphQL api responses

const createSingleTreeItem = ({ path, blob: { sha } }) => ({
  mode: fileModes[itemTypes.BLOB],
  type: itemTypes.BLOB,
  path,
  sha,
})

const createTreeItems = (blobInfo, multi) => {
  if (!multi) return [createSingleTreeItem(blobInfo)]

  return blobInfo.map(createSingleTreeItem)
}

const createBlobInfo = async ({
  client,
  repo,
  owner,
  files,
  multi,
}) => {
  if (!multi) {
    const { path, content } = files
    const blob = await client.createBlob({
      repo,
      owner,
      content,
    })

    return { path, blob }
  }

  const blobPromises = files.map(async ({ path, content }) => {
    const blob = await client.createBlob({
      repo,
      owner,
      content,
    })

    return { path, blob }
  })

  return Promise.all(blobPromises)
}

const createContent = (client) => async ({
  repo,
  owner,
  branch,
  files,
  commitMessage,
}) => {
  const parentCommitInfo = await client.getBaseCommitInfo({ owner, repo, branch })

  const parentCommit = get(parentCommitInfo, 'repository.ref.target.commitSha')
  const baseTree = get(parentCommitInfo, 'repository.ref.target.tree.sha')
  const multi = Array.isArray(files)

  const blobInfo = await createBlobInfo({
    client,
    repo,
    owner,
    files,
    multi,
  })

  const treeItems = await createTreeItems(blobInfo, multi)

  const { sha: treeSha } = await client.createTree({
    repo,
    owner,
    baseTree,
    treeItems,
  })

  const { sha: commitSha } = await client.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: treeSha,
    parents: parentCommit ? [parentCommit] : [],
  })

  await client.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })

  return multi
    ? blobInfo.map(({ path, blob: { sha } }) => ({ path, sha }))
    : ({ path: blobInfo.path, sha: blobInfo.blob.sha })
}

const getFileContent = (client) => async ({
  owner,
  repo,
  branch,
  path,
}) => {
  const response = await client.getFileContent({
    owner,
    repo,
    branch,
    path,
  }).catch((errorResponse) => {
    if (get(errorResponse, 'errors[0].type') === errors.NOT_FOUND) return null

    throw errorResponse
  })

  return get(response, 'repository.ref.target.file.object.text', null)
}

const getFolderContent = (client) => async ({
  owner,
  repo,
  branch,
  path,
}) => {
  const response = await client.getFolderContent({
    owner,
    repo,
    branch,
    path,
  }).catch((errorResponse) => {
    if (get(errorResponse, 'errors[0].type') === errors.NOT_FOUND) return null

    throw errorResponse
  })

  if (!response) return []

  const entries = get(response, 'repository.ref.target.files.object.entries') || []
  const filesContent = entries
    .filter((entry) => get(entry, 'object.__typename') === TYPENAME_BLOB)

  return filesContent
}

const deleteContent = (client) => async ({
  repo,
  owner,
  branch,
  path,
  commitMessage,
}) => {
  const parentCommitInfo = await client.getBaseCommitInfo({ owner, repo, branch })

  const parentCommit = get(parentCommitInfo, 'repository.ref.target.commitSha')
  const baseTree = get(parentCommitInfo, 'repository.ref.target.tree.sha')

  const treeItems = await createTreeItems({
    path,
    blob: { sha: null }, // sha=null will be delete the file
  })

  const { sha: treeSha } = await client.createTree({
    repo,
    owner,
    baseTree,
    treeItems,
  })

  const { sha: commitSha } = await client.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: treeSha,
    parents: parentCommit ? [parentCommit] : [],
  })

  await client.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })

  return true
}

export default (client) => ({
  createContent: createContent(client),
  getContent: getFileContent(client),
  getFolderContent: getFolderContent(client),
  deleteContent: deleteContent(client),
})
