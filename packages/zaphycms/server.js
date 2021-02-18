/* eslint-disable import/first */

require('core-js/stable')
require('regenerator-runtime/runtime')

import dotenv from 'dotenv'
import { createServer } from 'zaphycms-server'

dotenv.config({ path: `${process.env.DOTENV_PATH || '.'}/.env` })

const PORT = process.env.PORT || 3000

const server = createServer({
  cookieSecret: process.env.COOKIE_SECRET,
  git: {
    ownerSecret: process.env.GIT_OWNER_SECRET,
    owner: process.env.GIT_OWNER,
    repo: process.env.GIT_REPO,

    visibility: process.env.GIT_REPO_VISIBILITY,
    defaultBranch: process.env.GIT_DEFAULT_BRANCH,
  },
  logger: true,
  oauthClientId: process.env.GIT_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.GIT_OAUTH_CLIENT_SECRET,
  oauthScope: process.env.GIT_OAUTH_SCOPE?.split(','),
  playground: process.env.GRAPHQL_PLAYGROUND,
})

server.listen(PORT, (err) => {
  if (err) {
    server.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
    process.exit(1)
  }

  server.log.info(`Server running on port ${PORT}`)
})
