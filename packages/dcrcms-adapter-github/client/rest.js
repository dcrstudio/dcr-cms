import { Octokit } from '@octokit/core'

import { DEFAULT_REPO_DESCRIPTION } from '../constants'

const getAuthenticatedUser = (client) => async () => {
  const { data: userInfo, headers } = await client('/user')

  const { 'x-oauth-scopes': scope } = headers || {}
  const { login: username, avatar_url: avatarUrl, email } = userInfo

  const user = {
    username,
    avatarUrl,
    email,
    scope,
  }

  return user
}

const contents = (client) => async ({ owner, repo, path }) => {
  const { data } = await client.request(`/repos/${owner}/${repo}/contents/${path}`)

  return data
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

const getOAuthLoginUrl = () => ({ clientId, scope }) => {
  const scopeParamString = scope && scope.length ? `&scope=${scope.join(',')}` : ''

  return `https://github.com/login/oauth/authorize?client_id=${clientId}${scopeParamString}`
}

const getOAuthAccessToken = () => ({ clientId, clientSecret, query }) => {
  const { code } = query || {}

  return new Octokit().request(
    'POST https://github.com/login/oauth/access_token',
    {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    },
    { headers: { Accept: 'application/json' } },
  )
    .then(({ data }) => {
      const { access_token: accessToken } = data || {}

      return accessToken
    })
    // TODO: handle and format error
}

const githubRestAdapter = (client) => {
  const methodsMap = {
    // content
    contents,
    createBlob,
    createTree,
    createCommit,

    // repo
    createRepository,

    // refs
    createRef,
    updateRef,

    // user
    getAuthenticatedUser,

    // oatuh
    getOAuthAccessToken,
    getOAuthLoginUrl,
  }

  return Object.keys(methodsMap).reduce((initializedMethods, methodName) => ({
    ...initializedMethods,
    [methodName]: methodsMap[methodName](client),
  }), {})
}

export default githubRestAdapter
