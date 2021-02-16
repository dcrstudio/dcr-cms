import fastifyPlugin from 'fastify-plugin'
import mercurius from 'mercurius'

import { createSchema } from '../graphql'

const graphqlPlugin = async (fastify, opts, next) => {
  async function createZaphySchema() {
    fastify.log.info('Fecthing ContentTypes...')

    const contentTypes = await fastify.git.getContentTypes()

    fastify.log.info('Generating GraphQL schema...')

    // eslint-disable-next-line no-use-before-define
    const schema = createSchema(contentTypes, updateSchema)

    return schema
  }

  async function updateSchema() {
    const updatedSchema = await createZaphySchema()

    fastify.log.info('Updating schema...')

    await fastify.graphql.replaceSchema(updatedSchema)

    fastify.log.info('Schema updated.')
  }

  const { owner, repo, defaultBranch, paths } = fastify.config.git
  const { playground, path: graphqlPath } = opts

  fastify
    .register(mercurius, {
      schema: await createZaphySchema(),
      context: (request) => {
        if (request.isAnonymousUser) return {}

        return ({
          gitConfig: {
            branch: defaultBranch,
            owner,
            paths,
            repo,
          },
          gitAdapter: fastify
            .git
            .createAdapter({ secret: request.accessToken }),
        })
      },
      graphiql: playground && 'playground',
      path: graphqlPath,
    })

  next() // end of plugin
}

// prevents introspection query from authenticating
export const createPreAuthHandler = (graphqlEndpointUrl) => (request, reply, done) => {
  const { url, method } = request.raw
  const { operationName } = request.body || {}

  if (url === graphqlEndpointUrl && method.toUpperCase() === 'POST' && operationName === 'IntrospectionQuery') {
    request.setIsAnonymousUser(true)
  }

  done()
}

export default fastifyPlugin(graphqlPlugin, {
  name: 'zaphycms-graphql',
  fastify: '3.x',
  decorators: {
    fastify: [
      'config',
      'git',
    ],
    request: [
      'accessToken',
      'cookies',
      'isAnonymousUser',
      'setIsAnonymousUser',
    ],
  },
  dependencies: [
    'zaphycms-auth',
    'zaphycms-config',
    'zaphycms-git',

  ],
})
