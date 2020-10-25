import content from './content'
import contentType from './contentType'
import repository from './repository'
import user from './user'

export default (unifiedClient) => ({
  content: content(unifiedClient),
  contentType: contentType(unifiedClient),
  repository: repository(unifiedClient),
  user: user(unifiedClient),
})
