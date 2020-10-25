/* eslint-disable import/first */

require('core-js/stable')
require('regenerator-runtime/runtime')

import dotenv from 'dotenv'
import Server from 'dcrcms-server'

dotenv.config()

const server = new Server({
  playground: process.env.GRAPHQL_PLAYGROUND,
  port: process.env.PORT || 3000,
  gitConfig: {
    secret: process.env.GITHUB_SECRET,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    visibility: process.env.GITHUB_REPO_VISIBILITY,
  },
})

server.start()
