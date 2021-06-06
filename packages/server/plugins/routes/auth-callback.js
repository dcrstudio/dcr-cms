// add authentication callback route/handler
const authCallback = (fastify, { oauthClientSecret }, next) => {
  const { cookieDomain, isProduction, oauth } = fastify.config

  fastify.get(oauth.callback, async (request, reply) => {
    const { accessToken, error, errorMessage } = await fastify.git.getOAuthAccessToken({
      clientId: oauth.clientId,
      clientSecret: oauthClientSecret,
      query: request.query,
    })
      .then((data) => ({ accessToken: data }))
      .catch((errorResponse) => {
        fastify.log.error('authCallback -> errorResponse', errorResponse)

        return { error: 400, errorMessage: '400 Bad Request' }
      })

    if (error || !accessToken) {
      return reply
        .clearCookie('access_token', { path: '/' })
        .clearCookie('user', { path: '/' })
        .status(error || 401)
        .send(error ? errorMessage : 'Unauthorized')
    }

    return reply
      .setCookie('access_token', accessToken, {
        domain: cookieDomain,
        path: '/',
        signed: isProduction,
      })
      .redirect(oauth.login)
  })

  next() // end of plugin
}

export default authCallback
