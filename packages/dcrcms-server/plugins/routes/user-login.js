// user login handler
const userlogin = (request, reply) => {
  const { query, cookies } = request
  const { returnUrl: returnUrlCookie = '/' } = cookies || {}
  const { returnUrl } = query || {}

  return reply.redirect(returnUrl || returnUrlCookie)
}

export default userlogin
