import fastifyPlugin from 'fastify-plugin'
import githubAdapter from 'dcrcms-adapter-github'

import { buildPaths } from '../helpers'

const GITHUB_ADAPTER = 'github'

// only supports GitHub at this moment
const gitAdapters = { [GITHUB_ADAPTER]: githubAdapter }
const defaultBranches = { [GITHUB_ADAPTER]: 'main' }

const gitPlugin = async (fastify, opts, next) => {
  const {
    secret: ownerSecret,
    owner,
    repo,
    defaultBranch,
    visibility = 'public',
    paths,
    adapter = GITHUB_ADAPTER,
  } = opts

  const gitConfig = {
    repo,
    owner,
    paths: buildPaths(paths),
    defaultBranch: defaultBranch || defaultBranches[adapter],
    adapter,
  }

  const createGitAdapter = ({ secret }) => gitAdapters[adapter]({ secret })

  fastify.log.info(`Preparing repository: ${owner}/${repo}`)

  const gitAdapter = createGitAdapter({ secret: ownerSecret })

  await gitAdapter
    .repository
    .init({
      owner,
      name: repo,
      isPrivate: visibility === 'private',
    })
    .then((repositoryInitialized) => {
      fastify.log.info(`Repository ready: ${repositoryInitialized}`)
    })
    .catch((error) => {
      fastify.log.error(`Failed to initialize repository: ${owner}/${repo}`, error)

      throw error
    })

  const getContentTypes = () => gitAdapter.contentType.getAll({
    owner: gitConfig.owner,
    repo: gitConfig.repo,
    branch: gitConfig.defaultBranch,
    path: gitConfig.paths.contentTypes,
  })

  await fastify.decorate('git', {
    config: gitConfig,
    createAdapter: createGitAdapter,
    getContentTypes,
  })

  next() // end of plugin
}

export default fastifyPlugin(gitPlugin, { name: 'dcrcms-git' })
