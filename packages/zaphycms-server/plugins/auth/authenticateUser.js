import fastifyPlugin from 'fastify-plugin'

const authenticateUser = (fastify, { authenticatedRoutes = [] }, next) => {
  const { cookieDomain, isProduction } = fastify.config

  const setAccessToken = (request, reply, done) => {
    const { access_token: cookieSignedAccessToken } = request.cookies
    const { authorization: headerSignAccessToken } = request.raw.headers
    const signedAccessToken = headerSignAccessToken || cookieSignedAccessToken
    const accessToken = isProduction
      ? signedAccessToken && reply.unsignCookie(signedAccessToken)
      : signedAccessToken

    request.setAccessToken(accessToken)

    done()
  }

  const setUser = (request, reply, done) => {
    if (request.isAnonymousUser) {
      done()

      return
    }

    if (!request.accessToken) {
      reply
        .clearCookie('access_token', { path: '/' })
        .clearCookie('user', { path: '/' })

      request.setUser(null)

      done()

      return
    }

    const gitAdapter = fastify.git.createAdapter({ secret: request.accessToken })

    gitAdapter.user.getAuthenticated().then((user) => {
      if (!user) {
        done()

        return
      }

      request.setUser(user)
      reply.setCookie('user', JSON.stringify(user), {
        domain: cookieDomain,
        path: '/',
      })

      done()
    })
      .catch(({ status, headers: { status: statusText } }) => {
        fastify.log.error(`${status} - ${statusText}`)

        reply
          .clearCookie('access_token', { path: '/' })
          .clearCookie('user', { path: '/' })

        request.setUser(null)

        done()
      })
  }

  fastify.addHook('onRoute', (routeOptions) => {
    const { route } = authenticatedRoutes
      .find(({ route: currentRoute, method }) => {
        const matchesMethod = !method || method.toUpperCase() === routeOptions.method.toUpperCase()

        return currentRoute === routeOptions.url && matchesMethod
      }) || {}

    if (!route) return

    /* eslint-disable-next-line no-param-reassign */
    routeOptions.preValidation = [].concat(
      routeOptions.preValidation || [],
      setAccessToken,
      setUser,
    )
  })

  next() // end of plugin
}

export default fastifyPlugin(authenticateUser, {
  name: 'zaphycms-authenticate-user',
  fastify: '3.x',
  decorators: {
    fastify: [
      'axios',
      'config',
    ],
    request: [
      'accessToken',
      'cookies',
      'isAnonymousUser',
      'setAccessToken',
      'setUser',
    ],
    reply: [
      'clearCookie',
      'setCookie',
      'unsignCookie',
    ],
  },
  dependencies: [
    'zaphycms-config',
    'fastify-axios',
    'fastify-cookie',
  ],
})
