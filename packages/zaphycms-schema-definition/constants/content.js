import { FILE_EXTENSION } from './shared'

export const REGEX_PATH_CONTENT_TYPE_ID = new RegExp(`(?:.*\\/)?(.*)\\/(?:.*)\\.${FILE_EXTENSION}$`)

// GraphQL related
export const CONTENT_ID_FIELD_NAME = 'id'
export const CONTENT_ID_FIELD_TYPE = 'ID'

export const CONTENT_INTERFACE = 'Content'

// Sys types
export const SYS_CONTENT_TYPE = `Sys${CONTENT_INTERFACE}`
export const SYS_CONTENT_FIELD_TYPE = `Sys${CONTENT_INTERFACE}Field`
export const SYS_CONTENT_TYPE_ENUM = `Sys${CONTENT_INTERFACE}TypeEnum`
export const SYS_CONTENT_TYPE_UNION = `Sys${CONTENT_INTERFACE}Type`
