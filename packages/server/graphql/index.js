import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypeDefs, mergeResolvers } from '@graphql-toolkit/schema-merging'
import { createSchemaDefinition } from 'safis-cms-schema'

import rootTypeDefs from './typeDefs'

const createSchema = (contentTypes, schemaUpdater) => {
  const {
    typeDefs: cmsTypeDefs,
    resolvers: cmsResolvers,
  } = createSchemaDefinition(contentTypes, schemaUpdater)

  const typeDefsList = [rootTypeDefs, ...cmsTypeDefs]
  const resolversList = [...cmsResolvers]

  const typeDefs = mergeTypeDefs(typeDefsList, { all: true })
  const resolvers = mergeResolvers(resolversList)

  return makeExecutableSchema({ typeDefs, resolvers })
}

export { createSchema }
