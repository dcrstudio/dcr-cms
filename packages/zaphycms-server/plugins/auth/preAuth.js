import fastifyPlugin from 'fastify-plugin'

const preAuth = (fastify, { authenticatedRoutes = [] }, next) => {
  fastify.addHook('onRoute', (routeOptions) => {
    const { route, preAuth: onPreAuth } = authenticatedRoutes
      .find(({ route: currentRoute, method }) => {
        const matchesMethod = !method || method.toUpperCase() === routeOptions.method.toUpperCase()

        return currentRoute === routeOptions.url && matchesMethod
      }) || {}

    if (!route || !onPreAuth) return

    /* eslint-disable-next-line no-param-reassign */
    routeOptions.preValidation = [].concat(
      routeOptions.preValidation || [],
      onPreAuth,
    )
  })

  next() // end of plugin
}

export default fastifyPlugin(preAuth, {
  name: 'zaphycms-pre-auth',
  fastify: '3.x',
})
