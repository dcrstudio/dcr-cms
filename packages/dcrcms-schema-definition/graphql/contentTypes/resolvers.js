import camelCase from 'lodash.camelcase'

import { CONTENT_TYPE_TYPE } from '../../constants/contentType'
import { getContentTypePath } from '../../helpers/path'

const formatFields = (fields) => {
  if (!fields) return []

  return fields.map(({ id, ...fieldProps }) => ({
    id: camelCase(id || fieldProps.name),
    ...fieldProps,
  }))
}

const createQueryResolver = ({ multi } = {}) => async (_, { id }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context

  if (multi) {
    return gitAdapter.contentType.getAll({
      owner,
      repo,
      path: paths.contentTypes,
      branch,
    })
  }

  const content = await gitAdapter.contentType.get({
    owner,
    repo,
    path: getContentTypePath(paths, id),
    branch,
  })

  return content
}

const addResolver = async (_, { input }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context
  const {
    id: inputId,
    fields,
    ...contentType
  } = input
  const id = inputId || camelCase(contentType.name)
  const path = getContentTypePath(paths, id)

  const content = { id, ...contentType }

  if (fields) {
    content.fields = formatFields(fields)
  }

  return gitAdapter.contentType.create({
    owner,
    repo,
    branch,
    path,
    content,
  })
}

const updateResolver = async (_, { input }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context
  const {
    id,
    fields,
    ...contentType
  } = input

  if (fields) {
    contentType.fields = formatFields(fields)
  }

  return gitAdapter.contentType.update({
    owner,
    repo,
    branch,
    path: getContentTypePath(paths, id),
    content: contentType,
  })
}

const deleteResolver = (_, { id }, context) => {
  const { gitAdapter, owner, repo, branch, paths } = context

  return gitAdapter.contentType.delete(({
    owner,
    repo,
    branch,
    path: getContentTypePath(paths, id),
  }))
}

const queryResolvers = {
  [camelCase(CONTENT_TYPE_TYPE)]: createQueryResolver(),
  [`${camelCase(CONTENT_TYPE_TYPE)}s`]: createQueryResolver({ multi: true }),
}

const createSchemaUpdaterHandler = (schemaUpdater) => (mutationResolver) => async (...args) => {
  const result = await mutationResolver(...args)

  schemaUpdater()

  return result
}

const createMutationResolvers = (schemaUpdater) => {
  const reflectStructuralChange = createSchemaUpdaterHandler(schemaUpdater)

  return {
    [`add${CONTENT_TYPE_TYPE}`]: reflectStructuralChange(addResolver),
    [`update${CONTENT_TYPE_TYPE}`]: reflectStructuralChange(updateResolver),
    [`delete${CONTENT_TYPE_TYPE}`]: reflectStructuralChange(deleteResolver),
  }
}

export const createResolvers = (schemaUpdater) => ({
  Query: queryResolvers,
  Mutation: createMutationResolvers(schemaUpdater),
})
