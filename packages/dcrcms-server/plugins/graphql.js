import fastifyPlugin from 'fastify-plugin'
import mercurius from 'mercurius'

import { createSchema } from '../graphql'

const graphqlPlugin = async (fastify, { playground }, next) => {
  async function createDCRSchema() {
    fastify.log.info('Fecthing ContentTypes...')

    const contentTypes = await fastify.git.getContentTypes()

    fastify.log.info('Generating GraphQL schema...')

    // eslint-disable-next-line no-use-before-define
    const schema = createSchema(contentTypes, updateSchema)

    return schema
  }

  async function updateSchema() {
    const updatedSchema = await createDCRSchema()

    fastify.log.info('Updating schema...')

    await fastify.graphql.replaceSchema(updatedSchema)

    fastify.log.info('Schema updated.')
  }

  const { owner, repo, defaultBranch, paths } = fastify.git.config

  fastify.register(mercurius, {
    schema: await createDCRSchema(),
    context: (request) => ({
      gitConfig: {
        branch: defaultBranch,
        owner,
        paths,
        repo,
      },
      gitAdapter: fastify.git.createAdapter({ secret: process.env.GITHUB_SECRET }), // TODO: use request.user.secret
    }),
    graphiql: playground && 'playground',
  })

  next() // end of plugin
}

export default fastifyPlugin(graphqlPlugin, { name: 'dcrcms-graphql' })
