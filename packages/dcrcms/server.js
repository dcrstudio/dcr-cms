/* eslint-disable import/first */

require('core-js/stable')
require('regenerator-runtime/runtime')

import dotenv from 'dotenv'
import { createServer } from 'dcrcms-server'

dotenv.config()

const PORT = process.env.PORT || 3000

const server = createServer({
  cookieSecret: process.env.COOKIE_SECRET,
  git: {
    ownerSecret: process.env.GITHUB_SECRET,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,

    visibility: process.env.GITHUB_REPO_VISIBILITY,
    defaultBranch: process.env.GITHUB_DEFAULT_BRANCH,
  },
  logger: true,
  oauthClientId: process.env.GITHUB_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  oauthScope: process.env.GITHUB_OAUTH_SCOPE.split(','),
  playground: process.env.GRAPHQL_PLAYGROUND,
})

server.listen(PORT, (err) => {
  if (err) {
    server.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
    process.exit(1)
  }

  server.log.info(`Server running on port ${PORT}`)
})
