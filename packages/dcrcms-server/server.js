import Fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'

import { gitPlugin, graphqlPlugin } from './plugins'

const createServer = (config = {}) => {
  const {
    git: gitConfig = {},
    playground,
    ...fastifyConfigs
  } = config

  const fastify = Fastify(fastifyConfigs)

  fastify.register(fastifyCookie)

  fastify.register(gitPlugin, gitConfig)

  fastify.register(graphqlPlugin, { playground })

  return fastify
}

export { createServer }
