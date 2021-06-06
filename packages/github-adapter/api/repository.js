import get from 'lodash.get'

import createFileApi from '../helpers/createFileApi'
import { DEFAULT_REPO_DESCRIPTION } from '../constants'

const initRepository = (client) => async ({
  owner,
  name,
  isPrivate = false,
  description,
}) => {
  const fileApi = createFileApi(client)
  const existingRepoInfo = await client.getRepository({ owner, name }).catch((error) => {
    if (get(error, 'errors[0].type') === 'NOT_FOUND') return {}

    throw error
  })

  if (get(existingRepoInfo, 'repository.name')) return 'FOUND'

  await client.createRepository({
    name,
    description,
    isPrivate,
  })

  await fileApi.createContent({
    repo: name,
    owner,
    branch: 'main', // default branch
    files: {
      path: 'README.md',
      content: DEFAULT_REPO_DESCRIPTION,
    },
    commitMessage: 'Safis CMS initial commit',
  })

  return 'CREATED'
}

export default (client) => ({ init: initRepository(client) })
