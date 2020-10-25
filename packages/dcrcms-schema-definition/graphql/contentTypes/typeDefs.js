import camelCase from 'lodash.camelcase'

import {
  CONTENT_TYPE_ID_FIELD_NAME,
  CONTENT_TYPE_ID_FIELD_TYPE,
  CONTENT_TYPE_TYPE,
  CONTENT_TYPE_FIELD,
  CONTENT_TYPE_FIELD_TYPE_ENUM,
  CONTENT_TYPE_FIELD_INPUT,
} from '../../constants/contentType'

const typeDefs = `
enum ${CONTENT_TYPE_FIELD_TYPE_ENUM} {
  String
  Number
  Boolean
  Reference
}

input ${CONTENT_TYPE_FIELD_INPUT} {
  id: ID!
  name: String!
  description: String
  type: ${CONTENT_TYPE_FIELD_TYPE_ENUM}!
}

input ${CONTENT_TYPE_TYPE}Input {
  ${CONTENT_TYPE_ID_FIELD_NAME}: ${CONTENT_TYPE_ID_FIELD_TYPE}
  name: String!
  description: String
  fields: [${CONTENT_TYPE_FIELD_INPUT}!]
}

input ${CONTENT_TYPE_TYPE}UpdateInput{
  ${CONTENT_TYPE_ID_FIELD_NAME}: ${CONTENT_TYPE_ID_FIELD_TYPE}!
  name: String
  description: String
  fields: [${CONTENT_TYPE_FIELD_INPUT}!]
}

type ${CONTENT_TYPE_FIELD} {
  id: ID!
  name: String!
  description: String
  type: ${CONTENT_TYPE_FIELD_TYPE_ENUM}!
}

type ${CONTENT_TYPE_TYPE} {
  ${CONTENT_TYPE_ID_FIELD_NAME}: ${CONTENT_TYPE_ID_FIELD_TYPE}!
  name: String!
  description: String
  fields: [${CONTENT_TYPE_FIELD}!]!
}

type Query {
  ${camelCase(CONTENT_TYPE_TYPE)}(${CONTENT_TYPE_ID_FIELD_NAME}: ${CONTENT_TYPE_ID_FIELD_TYPE}!): ${CONTENT_TYPE_TYPE}
  ${camelCase(CONTENT_TYPE_TYPE)}s: [${CONTENT_TYPE_TYPE}]
}

type Mutation {
  add${CONTENT_TYPE_TYPE}(input: ${CONTENT_TYPE_TYPE}Input!): ${CONTENT_TYPE_TYPE}
  update${CONTENT_TYPE_TYPE}(input: ${CONTENT_TYPE_TYPE}UpdateInput!): ${CONTENT_TYPE_TYPE}
  delete${CONTENT_TYPE_TYPE}(${CONTENT_TYPE_ID_FIELD_NAME}: ${CONTENT_TYPE_ID_FIELD_TYPE}!): Boolean!
}
`

export default typeDefs
