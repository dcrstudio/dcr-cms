import authCallback from './auth-callback'
import userlogin from './user-login'

const routesPlugin = (fastify, { oauthClientSecret }, next) => {
  const { login: oauthLoginUrl } = fastify.config.oauth

  fastify.get(oauthLoginUrl, userlogin)

  fastify.register(authCallback, { oauthClientSecret })

  next() // end of plugin
}

export default routesPlugin
