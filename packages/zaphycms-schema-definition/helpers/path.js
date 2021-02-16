import { REGEX_PATH_CONTENT_TYPE_ID } from '../constants/content'
import { FILE_EXTENSION } from '../constants/shared'

// contentTypes
export const getContentTypePath = ({ contentTypes } = {}, id) => `${contentTypes}${id}.${FILE_EXTENSION}`

// content
export const getContentTypeIdFromContentPath = (path = '') => (path.match(REGEX_PATH_CONTENT_TYPE_ID) || [])[1]
export const getContentPath = ({ content } = {}, sysId, id) => `${content}${sysId}/${id}.${FILE_EXTENSION}`
