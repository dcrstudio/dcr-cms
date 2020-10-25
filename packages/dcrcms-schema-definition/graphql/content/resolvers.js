import camelCase from 'lodash.camelcase'
import { v4 as uuid } from 'uuid'

import pascalCase from '../../helpers/pascalCase'
import {
  getContentTypeIdFromContentPath,
  getContentPath,
} from '../../helpers/path'

const createDeleteResolver = (contentType) => (_, { id }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context

  return gitAdapter.content.delete(({
    owner,
    repo,
    branch,
    path: getContentPath(paths, contentType.id, id),
  }))
}

const createQueryContentResolver = (contentType) => async (_, input, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context

  return gitAdapter.content.getAll({
    owner,
    repo,
    path: `${paths.content}${contentType.id}/`,
    branch,
  })
}
const createQuerySingleContentResolver = (contentType) => async (_, { id }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context
  const path = getContentPath(paths, contentType.id, id)

  const content = await gitAdapter.content.get({
    owner,
    repo,
    path,
    branch,
  })

  return content && {
    ...content,
    sys: { id: getContentTypeIdFromContentPath(path) }, // we might not need this. TODO: VERIFY
  }
}

const createAddContentResolver = (contentType) => async (_, { input: content }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context
  const id = uuid()
  const path = getContentPath(paths, contentType.id, id)
  const newContent = await gitAdapter.content.create({
    owner,
    repo,
    branch,
    path,
    content: { ...content, id },
  })

  return newContent
}

const createUpdateContent = (contentType) => async (_, { input: content }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context

  const updatedContent = await gitAdapter.content.update({
    owner,
    repo,
    branch,
    path: getContentPath(paths, contentType.id, content.id),
    content,
  })

  return updatedContent
}

const createContentQueryResolvers = ({ contentGraphQLTypes, contentTypesMap }) => (
  contentGraphQLTypes.reduce((queryResolvers, type) => {
    const contentType = contentTypesMap[type]

    return {
      ...queryResolvers,
      [camelCase(type)]: createQuerySingleContentResolver(contentType),
      [`${camelCase(type)}s`]: createQueryContentResolver(contentType),
    }
  }, {})
)

const createContentMutationResolvers = ({ contentGraphQLTypes, contentTypesMap }) => (
  contentGraphQLTypes.reduce((mutationResolvers, graphQLType) => {
    const contentType = contentTypesMap[graphQLType]

    return {
      ...mutationResolvers,
      [`add${graphQLType}`]: createAddContentResolver(contentType),
      [`update${graphQLType}`]: createUpdateContent(contentType),
      [`delete${graphQLType}`]: createDeleteResolver(contentType),
    }
  }, {})
)

const createSysContentResolvers = (contentTypesMap) => Object.keys(contentTypesMap)
  .reduce((sysResolvers, contentGraphQLType) => ({
    ...sysResolvers,
    [contentGraphQLType]: {
      sys: () => ({
        ...contentTypesMap[contentGraphQLType],
        id: contentGraphQLType,
      }),
    },
  }), {})

export const createResolvers = ({ contentTypes, contentGraphQLTypes }) => {
  const contentTypesMap = contentTypes.reduce((contentTMap, contentType) => ({
    ...contentTMap,
    [pascalCase(contentType.id)]: contentType,
  }), {})

  return {
    Query: createContentQueryResolvers({ contentTypesMap, contentGraphQLTypes }),
    Mutation: createContentMutationResolvers({ contentTypesMap, contentGraphQLTypes }),
    ...createSysContentResolvers(contentTypesMap),
  }
}
