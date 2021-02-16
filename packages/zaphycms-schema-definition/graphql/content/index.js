import pascalCase from '../../helpers/pascalCase'
import { createContentTypeDefs, createTypeDefs } from './typeDefs'
import { createResolvers } from './resolvers'

const createContentSchema = ({ contentTypes }) => {
  const queries = []
  const mutations = []
  const contentGraphQLTypes = contentTypes.map(({ id }) => pascalCase(id))
  const content = []

  contentTypes.forEach(({ id, fields }) => {
    const graphqlType = pascalCase(id)
    const cTypeDefs = createContentTypeDefs({
      fields,
      graphqlType,
      contentGraphQLTypes,
    })

    content.push(...cTypeDefs.content)
    queries.push(...cTypeDefs.queries)
    mutations.push(...cTypeDefs.mutations)
  })

  const typeDefs = createTypeDefs({
    contentTypes: content,
    contentGraphQLTypes,
    queries,
    mutations,
  })

  const resolvers = createResolvers({ contentTypes, contentGraphQLTypes })

  // return { }
  return { typeDefs, resolvers }
}

export { createContentSchema }
