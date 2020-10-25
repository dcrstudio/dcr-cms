import typeDefs from './typeDefs'
import { createResolvers } from './resolvers'

const createContentTypeSchema = (schemaUpdater) => ({
  typeDefs,
  resolvers: createResolvers(schemaUpdater),
})

export { createContentTypeSchema }
