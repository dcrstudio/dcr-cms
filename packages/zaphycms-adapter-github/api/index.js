import content from './content'
import contentType from './contentType'
import oauth from './oauth'
import repository from './repository'
import user from './user'

export default (unifiedClient) => ({
  content: content(unifiedClient),
  contentType: contentType(unifiedClient),
  oauth: oauth(unifiedClient),
  repository: repository(unifiedClient),
  user: user(unifiedClient),
})
