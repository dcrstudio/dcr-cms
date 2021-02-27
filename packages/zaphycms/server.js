/* eslint-disable import/first */

require('core-js/stable')
require('regenerator-runtime/runtime')

import dotenv from 'dotenv'
import { createServer } from 'zaphycms-server'

dotenv.config({ path: `${process.env.DOTENV_PATH || '.'}/.env` })

const PORT = process.env.PORT || 3000

const enablePlayground = process.env.ENABLE_GRAPHQL_PLAYGROUND === undefined
  || process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true'

const server = createServer({
  cookieSecret: process.env.COOKIE_SECRET,
  git: {
    ownerSecret: process.env.GIT_OWNER_SECRET,
    owner: process.env.GIT_OWNER,
    repo: process.env.GIT_REPO,

    visibility: process.env.GIT_REPO_VISIBILITY,
    defaultBranch: process.env.GIT_DEFAULT_BRANCH,
    paths: {
      root: process.env.GIT_ROOT_FOLDER,
      contentTypes: process.env.GIT_CONTENT_TYPES_FOLDER,
      content: process.env.GIT_CONTENT_FOLDER,
    },
  },
  logger: true,
  oatuhCallback: process.env.OAUTH_CALLBACK_URL,
  oauthClientId: process.env.GIT_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.GIT_OAUTH_CLIENT_SECRET,
  oauthScope: process.env.GIT_OAUTH_SCOPE?.split(','),
  oauthLogin: process.env.OAUTH_LOGIN_URL,
  enablePlayground,
})

server.listen(PORT, (err) => {
  if (err) {
    server.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
    process.exit(1)
  }

  server.log.info(`Server running on port ${PORT}`)
})
