import fastifyPlugin from 'fastify-plugin'

const forceLogin = (fastify, opts = {}, next) => {
  const { authenticatedRoutes = [] } = opts
  const { cookieDomain, oauth } = fastify.config

  const createOnPreValidation = ({ allowLoginRedirect }) => (request, reply, done) => {
    const { cookies, query, user, isAnonymousUser } = request
    const { returnUrl: returnUrlCookie = '/' } = cookies || {}
    const { returnUrl } = query || {}

    if (isAnonymousUser || user) {
      done()

      return
    }

    if (!allowLoginRedirect) {
      reply.status(401).send('Unauthorized')

      return
    }

    reply
      .clearCookie('user', { path: '/' })
      .setCookie('returnUrl', returnUrl || returnUrlCookie, {
        domain: cookieDomain,
        path: '/',
      })

    reply.redirect(fastify.git.getOAuthLoginUrl(oauth))

    done()
  }

  fastify.addHook('onRoute', (routeOptions) => {
    const {
      allowLoginRedirect,
      route,
    } = authenticatedRoutes
      .find(({ route: currentRoute, method }) => {
        const matchesMethod = !method || method.toUpperCase() === routeOptions.method.toUpperCase()

        return currentRoute === routeOptions.url && matchesMethod
      }) || {}

    if (!route) return

    const onPreValidation = createOnPreValidation({ allowLoginRedirect })

    /* eslint-disable-next-line no-param-reassign */
    routeOptions.preValidation = [].concat(
      routeOptions.preValidation || [],
      onPreValidation,
    )
  })

  next() // end of plugin
}

export default fastifyPlugin(forceLogin, {
  name: 'safis-cms-force-login',
  fastify: '3.x',
  decorators: {
    fastify: [
      'config',
      'git',
    ],
    request: [
      'cookies',
      'isAnonymousUser',
      'user',
    ],
    reply: [
      'clearCookie',
      'setCookie',
    ],
  },
  dependencies: [
    'safis-cms-config',
    'safis-cms-git',
    'fastify-cookie',
  ],
})
