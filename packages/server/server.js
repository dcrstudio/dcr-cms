import Fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyAxios from 'fastify-axios'

import { DEFAULT_GRAPHQL_ENDPOINT_URL } from './constants'
import { authPlugin, configPlugin, gitPlugin, graphqlPlugin, routesPlugin } from './plugins'
import { createPreAuthHandler } from './plugins/graphql'

const createServer = (config = {}) => {
  const {
    git: {
      ownerSecret: gitOwnerSecret,
      ...gitConfig
    } = {},
    enablePlayground = true,
    cookieSecret,
    isProduction,
    cookieDomain,
    oauthScope,
    oauthClientSecret,
    oauthClientId,
    oauthLogin,
    graphqlEndpointUrl = DEFAULT_GRAPHQL_ENDPOINT_URL,
    ...fastifyConfigs
  } = config

  const fastify = Fastify(fastifyConfigs)

  fastify.register(fastifyAxios).register(fastifyCookie, { secret: cookieSecret })

  fastify.register(configPlugin, {
    git: gitConfig,
    isProduction,
    cookieDomain,
    oauthScope,
    oauthClientId,
  })

  fastify.after((err) => {
    if (err) {
      fastify.log.error(err)
      
      throw err
    }
    
    fastify.register(gitPlugin, { ownerSecret: gitOwnerSecret })
    
    fastify.register(authPlugin, {
      authenticatedRoutes: [
        { route: fastify.config.oauth.login, allowLoginRedirect: true },
        { route: graphqlEndpointUrl, method: 'GET', allowLoginRedirect: true },
        { route: graphqlEndpointUrl, method: 'POST', preAuth: createPreAuthHandler(graphqlEndpointUrl) },
      ],
    })
    
    fastify.register(routesPlugin, { oauthClientSecret })

    fastify.register(graphqlPlugin, {
      playground: enablePlayground,
      oauthClientSecret,
      path: graphqlEndpointUrl,
    })
  })

  return fastify
}

export { createServer }
