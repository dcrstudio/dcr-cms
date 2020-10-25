import { createContentSchema } from './content'
import { createContentTypeSchema } from './contentTypes'

const createSchemaDefinition = (contentTypes, schemaUpdater) => {
  const {
    typeDefs: contentTypesTypeDefs,
    resolvers: contentTypesResolvers,
  } = createContentTypeSchema(schemaUpdater)

  const {
    typeDefs: contentTypeDefs,
    resolvers: contentResolvers,
  } = contentTypes && contentTypes.length ? createContentSchema({ contentTypes }) : {}

  const typeDefs = [contentTypesTypeDefs]
  const resolvers = [contentTypesResolvers]

  if (contentTypeDefs) {
    typeDefs.push(contentTypeDefs)
  }

  if (contentResolvers) {
    resolvers.push(contentResolvers)
  }

  return { typeDefs, resolvers }
}

export { createSchemaDefinition }
