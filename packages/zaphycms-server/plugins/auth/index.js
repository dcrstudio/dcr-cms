import fastifyPlugin from 'fastify-plugin'

import preAuth from './preAuth'
import authenticateUser from './authenticateUser'
import forceLogin from './forceLogin'

const authPlugin = (fastify, opts, next) => {
  const { authenticatedRoutes = [] } = opts || {}
  const routes = authenticatedRoutes.map((route) => (typeof route === 'string' ? { route } : route))

  function setAccessToken(accessToken) {
    this.accessToken = accessToken
  }

  function setUser(user) {
    this.user = user
  }
  function setIsAnonymousUser(isAnonymousUser) {
    this.isAnonymousUser = isAnonymousUser
  }

  // request decorators
  fastify.decorateRequest('setAccessToken', setAccessToken)
  fastify.decorateRequest('setIsAnonymousUser', setIsAnonymousUser)
  fastify.decorateRequest('setUser', setUser)

  // request decorated default values
  fastify.decorateRequest('accessToken', null)
  fastify.decorateRequest('isAnonymousUser', false)
  fastify.decorateRequest('user', null)

  // auth plugins
  fastify.register(preAuth, { authenticatedRoutes: routes })
  fastify.register(authenticateUser, { authenticatedRoutes: routes })
  fastify.register(forceLogin, { authenticatedRoutes: routes })

  next()
}

export default fastifyPlugin(authPlugin, {
  name: 'zaphycms-auth',
  fastify: '3.x',
  dependencies: [
    'zaphycms-config',
    'zaphycms-git',
    'fastify-axios',
    'fastify-cookie',
  ],
})
