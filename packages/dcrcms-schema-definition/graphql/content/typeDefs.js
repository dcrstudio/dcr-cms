import camelCase from 'lodash.camelcase'

import {
  CONTENT_ID_FIELD_NAME,
  CONTENT_ID_FIELD_TYPE,
  SYS_CONTENT_TYPE_ENUM,
  SYS_CONTENT_TYPE,
  CONTENT_INTERFACE,
  SYS_CONTENT_FIELD_TYPE,
  SYS_CONTENT_TYPE_UNION,
} from '../../constants/content'
import { CONTENT_TYPE_FIELD_TYPE_ENUM } from '../../constants/contentType'
import pascalCase from '../../helpers/pascalCase'

const getSysTypeDefs = (contentGraphQLTypes) => `
enum ${SYS_CONTENT_TYPE_ENUM} {
${contentGraphQLTypes.join(',\n')}
}

# extend enum ${CONTENT_TYPE_FIELD_TYPE_ENUM} {
#  Reference
  # or CONTENT_INTERFACE
  # or contentGraphQLTypes.join if the above does not work 
# }

########### MIGHT NEED TO REMOVE: FROM HERE
 # union ${SYS_CONTENT_TYPE_UNION} = String | Int | Boolean | ${SYS_CONTENT_TYPE_ENUM}
# 
# type ${SYS_CONTENT_FIELD_TYPE} {
#  name: String
#  type: ${SYS_CONTENT_TYPE_UNION}
#  
#}
########### MIGHT NEED TO REMOVE: UNTIL HERE


type ${SYS_CONTENT_TYPE} {
  id: ${SYS_CONTENT_TYPE_ENUM}!
  name: String!
  description: String
  # type: ${SYS_CONTENT_TYPE_ENUM}!
}

interface ${CONTENT_INTERFACE} {
  ${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}
  sys: ${SYS_CONTENT_TYPE}
}`

const REFERECE_FIELD_TYPE = 'Reference'

const CONTENT_TYPES_TYPE_TRANSFORM = {
  Number: 'Float',
  [REFERECE_FIELD_TYPE]: CONTENT_INTERFACE,
}

const getFieldType = ({
  fieldType,
  multi,
  isInput,
}) => {
  const formattedFieldType = `${pascalCase(CONTENT_TYPES_TYPE_TRANSFORM[fieldType] || fieldType)}`
  const isReference = isInput && fieldType === REFERECE_FIELD_TYPE
  const finalFieldType = isReference ? CONTENT_ID_FIELD_TYPE : formattedFieldType
  const multiTypeRequired = `${finalFieldType}${multi ? '!' : ''}` // prevents inserting null values

  return `${multi ? '[' : ''}${multiTypeRequired}${multi ? ']' : ''}`
}

const createContentFields = (
  fields,
  { isCreate = false, isInput = false, contentGraphQLTypes } = {},
) => (
  fields.map(({
    id: fieldName,
    type: fieldType,
    isRequired,
    multi,
  }) => {
    const graphqlFieldType = getFieldType({
      fieldType,
      multi,
      isInput,
      isRequired,
      contentGraphQLTypes,
    })
    const requiredString = isRequired && isCreate ? '!' : ''

    return `${fieldName}: ${graphqlFieldType}${requiredString}`
  })
)

export const createContentTypeDefs = ({
  fields,
  graphqlType,
  contentGraphQLTypes,
}) => ({
  content: [
    `type ${graphqlType} implements ${CONTENT_INTERFACE} {
        ${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}
        ${createContentFields(fields, { contentGraphQLTypes }).join('\n')}
        sys: ${SYS_CONTENT_TYPE}
      }`,
    `input ${graphqlType}Input {
        # ${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}!
        ${createContentFields(fields, { isCreate: true, isInput: true, contentGraphQLTypes }).join('\n')}
      }`,
    `input ${graphqlType}UpdateInput{
        ${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}!
        ${createContentFields(fields, { isInput: true, contentGraphQLTypes }).join('\n')}
      }`,
  ],
  queries: [
    `${camelCase(graphqlType)}(${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}!): ${graphqlType}`,
    `${camelCase(graphqlType)}s: [${graphqlType}]`,
  ],
  mutations: [
    `add${graphqlType}(input: ${graphqlType}Input!): ${graphqlType}`,
    `update${graphqlType}(input: ${graphqlType}UpdateInput!): ${graphqlType}`,
    `delete${graphqlType}(${CONTENT_ID_FIELD_NAME}: ${CONTENT_ID_FIELD_TYPE}!): Boolean`,
  ],
})

export const createTypeDefs = ({
  contentTypes,
  contentGraphQLTypes,
  queries,
  mutations,
}) => {
  const typeDefs = `
  ${getSysTypeDefs(contentGraphQLTypes)}

  ${contentTypes.join('\n\n')}

  type Query {
    ${queries.join('\n')}
  }

  type Mutation {
    ${mutations.join('\n')}
  }
  `

  return typeDefs
}
