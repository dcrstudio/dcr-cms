import fastifyPlugin from 'fastify-plugin'

import {
  DEFAULT_DOMAIN,
  GITHUB_ADAPTER,
  DEFAULT_OAUTH_CALLBACK_URL,
  DEFAULT_OAUTH_LOGIN_URL,
  VISIBILITY_PRIVATE,
  VISIBILITY_PUBLIC,
} from '../constants'
import { buildPaths } from '../helpers'

// only supports GitHub at this moment
const defaultBranches = { [GITHUB_ADAPTER]: 'main' }

const configPlugin = (fastify, opts, next) => {
  const {
    // cookies configs
    cookieDomain = DEFAULT_DOMAIN,

    // git configs
    git: {
      adapter = GITHUB_ADAPTER,
      defaultBranch,
      owner,
      paths,
      repo,
      visibility = VISIBILITY_PUBLIC,
    } = {},

    // environment configs
    isProduction = process.env.NODE_ENV === 'production',

    // oauth configs
    oatuhCallback = DEFAULT_OAUTH_CALLBACK_URL,
    oauthClientId,
    oauthLogin = DEFAULT_OAUTH_LOGIN_URL,
    oauthScope = ['repo'],

  } = opts || {}

  fastify.decorate('config', {
    cookieDomain,
    git: {
      adapter,
      defaultBranch: defaultBranch || defaultBranches[adapter],
      isPrivate: visibility === VISIBILITY_PRIVATE,
      owner,
      paths: buildPaths(paths),
      repo,

    },
    isProduction,

    // oauth configs
    oauth: {
      callback: oatuhCallback,
      login: oauthLogin,
      clientId: oauthClientId,
      scope: oauthScope,
    },
  })

  next() // end of plugin
}

export default fastifyPlugin(configPlugin, {
  name: 'zaphycms-config',
  fastify: '3.x',
})
