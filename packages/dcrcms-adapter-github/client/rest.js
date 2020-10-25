import { DEFAULT_REPO_DESCRIPTION } from '../constants'

const getAuthenticatedUser = (client) => async () => {
  const { data: user } = await client('/user')

  return user
}

const contents = (client) => async ({ owner, repo, path }) => {
  const { data: user } = await client.request(`/repos/${owner}/${repo}/contents/${path}`)

  return user
}

const createRepository = (client) => async ({
  name,
  description = DEFAULT_REPO_DESCRIPTION, // generic description
  isPrivate = false,
}) => {
  const { data } = await client('POST /user/repos', {
    name,
    auto_init: true,
    description,
    private: isPrivate,
  })

  return data
}

const createBlob = (client) => async ({ owner, repo, content }) => {
  const { data: blob } = await client('POST /repos/{owner}/{repo}/git/blobs', {
    owner,
    repo,
    content,
  })

  return blob
}

const createTree = (client) => async ({
  owner,
  repo,
  treeItems,
  baseTree,
}) => {
  const { data: newTree } = await client(`POST /repos/${owner}/${repo}/git/trees`, {
    owner: 'octocat',
    repo: 'hello-world',
    base_tree: baseTree,
    tree: treeItems,
  })

  return newTree
}

const createCommit = (client) => async ({
  owner,
  repo,
  message,
  tree,
  parents,
}) => {
  const { data: commit } = await client(`POST /repos/${owner}/${repo}/git/commits`, {
    owner,
    repo,
    message,
    tree,
    parents,
  })

  return commit
}

const createRef = (client) => async ({
  owner,
  repo,
  ref,
  sha,
}) => {
  const { data: newRef } = await client(`POST /repos/${owner}/${repo}/git/refs`, {
    owner,
    repo,
    ref,
    sha,
  })

  return newRef
}

const updateRef = (client) => async ({
  owner,
  repo,
  ref,
  sha,
  force = false,
}) => {
  const { data: newRef } = await client(`PATCH /repos/${owner}/${repo}/git/refs/${ref}`, {
    owner,
    repo,
    ref,
    sha,
    force,
  })

  return newRef
}

const githubRestAdapter = (client) => ({
  getAuthenticated: getAuthenticatedUser(client),
  contents: contents(client),
  createBlob: createBlob(client),
  createRepository: createRepository(client),
  createTree: createTree(client),
  createCommit: createCommit(client),
  createRef: createRef(client),
  updateRef: updateRef(client),
})

export default githubRestAdapter
