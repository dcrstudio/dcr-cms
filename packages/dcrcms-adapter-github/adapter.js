import { Octokit } from '@octokit/core'

import graphql from './client/graphql'
import rest from './client/rest'
import api from './api'

const adapter = ({ secret }) => {
  const {
    graphql: graphqlClient,
    request: restClient,
  } = new Octokit({ auth: secret })

  const unifiedClient = {
    ...rest(restClient),
    ...graphql(graphqlClient),
  }

  return api(unifiedClient)
}

export default adapter
