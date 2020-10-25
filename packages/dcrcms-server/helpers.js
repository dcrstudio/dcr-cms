import {
  ROOT_FOLDER,
  CONTENT_TYPES_FOLDER,
  CONTENT_FOLDER,
} from './constants'

export const buildPaths = (paths) => {
  const {
    root: rootFolder = ROOT_FOLDER,
    contentTypes: contentTypesFolder = CONTENT_TYPES_FOLDER,
    content: contentFolder = CONTENT_FOLDER,
  } = paths || {}

  return {
    contentTypes: rootFolder ? `${rootFolder}/${contentTypesFolder}/` : `${contentTypesFolder}/`,
    content: rootFolder ? `${rootFolder}/${contentFolder}/` : `${contentFolder}/`,
  }
}
