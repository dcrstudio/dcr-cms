const getAuthenticatedUser = (client) => () => client.getAuthenticatedUser()

export default (client) => ({ getAuthenticated: getAuthenticatedUser(client) })
