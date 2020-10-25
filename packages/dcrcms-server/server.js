import Fastify from 'fastify'
import mercurius from 'mercurius'
import githubAdapter from 'dcrcms-adapter-github'

import { buildPaths } from './helpers'
import { createSchema } from './graphql'

class Server {
  constructor({
    playground = false,
    port = 3000,
    gitConfig: {
      secret,
      owner,
      repo,
      branch = 'main',
      visibility = 'public',
    } = {},
    paths,
  }) {
    this.git = {
      owner,
      repo,
      branch,
      visibility,
    }
    this.paths = buildPaths(paths)

    this.port = port
    this.playground = playground

    this.gitAdapter = githubAdapter({ secret })
    this.app = Fastify({ logger: { level: 'info' } })
  }

  async generateSchema() {
    const {
      gitAdapter,
      git: {
        owner,
        repo,
        branch,
      },
      app,
      paths,
    } = this

    app.log.info('Fecthing ContentTypes...')

    const contentTypes = await gitAdapter.contentType.getAll({
      owner,
      repo,
      branch,
      path: paths.contentTypes,
    })

    app.log.info('Generating GraphQL schema...')

    const schemaUpdater = () => {
      this.udpateSchema()
    }

    const schema = createSchema(contentTypes, schemaUpdater)

    app.log.info('GraphQL schema generated.')

    return schema
  }

  async start() {
    const {
      app,
      git: {
        owner,
        repo,
        branch,
        visibility,
      },
      port,
      gitAdapter,
      paths,
    } = this

    const repositoryInitialized = await gitAdapter
      .repository
      .init({
        owner,
        name: repo,
        isPrivate: visibility === 'private',
      })
      .catch((error) => {
        app.log.error('Failed to initialize repository:', { owner, repo }, error)

        throw error
      })

    app.log.info('Repository initialized:', repositoryInitialized)
    const schema = await this.generateSchema()

    this.app.register(mercurius, {
      schema,
      context: () => ({
        owner,
        repo,
        branch,
        gitAdapter,
        paths,
      }),
      graphiql: this.playground && 'playground',
    })

    app.listen(port, (err) => {
      if (err) {
        app.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
        process.exit(1)
      }

      app.log.info(`Server running on port ${port}`)
    })
  }

  async udpateSchema() {
    this.app.log.info('Updating GraphQL schema...')

    await this.app.graphql.replaceSchema(await this.generateSchema())

    this.app.log.info('GraphQL schema updated.')
  }
}

export default Server
