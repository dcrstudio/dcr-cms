const getLoginUrl = (client) => ({ clientId, scope } = {}) => client.getOAuthLoginUrl({
  clientId,
  scope,
})

const getAccessToken = (client) => (args = {}) => {
  const { clientId, clientSecret, query } = args

  return client.getOAuthAccessToken({ clientId, clientSecret, query })
}

export default (client) => ({
  getLoginUrl: getLoginUrl(client),
  getAccessToken: getAccessToken(client),
})
