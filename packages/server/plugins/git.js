import fastifyPlugin from 'fastify-plugin'
import githubAdapter from 'safis-cms-github-adapter'

import { GITHUB_ADAPTER, VISIBILITY_PRIVATE } from '../constants'

// provider methods
// only supports GitHub at this moment
const gitAdapters = { [GITHUB_ADAPTER]: githubAdapter }

const gitPlugin = async (fastify, opts, next) => {
  const { ownerSecret } = opts
  const { adapter, owner, repo, visibility, defaultBranch, paths } = fastify.config.git

  const createGitAdapter = ({ secret }) => gitAdapters[adapter]({ secret })

  fastify.log.info(`Preparing repository: ${owner}/${repo}`)

  const gitAdapter = createGitAdapter({ secret: ownerSecret })

  await gitAdapter
    .repository
    .init({
      owner,
      name: repo,
      isPrivate: visibility === VISIBILITY_PRIVATE,
    })
    .then((repositoryInitialized) => {
      fastify.log.info(`Repository ready: ${repositoryInitialized}`)
    })
    .catch((error) => {
      fastify.log.error(`Failed to initialize repository: ${owner}/${repo}`, error)

      throw error
    })

  const getContentTypes = () => gitAdapter.contentType.getAll({
    owner,
    repo,
    branch: defaultBranch,
    path: paths.contentTypes,
  })

  await fastify.decorate('git', {
    createAdapter: createGitAdapter,
    getContentTypes,
    getOAuthLoginUrl: gitAdapter.oauth.getLoginUrl,
    getOAuthAccessToken: gitAdapter.oauth.getAccessToken,
  })

  next() // end of plugin
}

export default fastifyPlugin(gitPlugin, {
  name: 'safis-cms-git',
  fastify: '3.x',
  decorators: {
    fastify: [
      'config',
    ],
  },
})
