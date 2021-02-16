import startCase from 'lodash.startcase'

const pascalCase = (string = '') => startCase(string).replace(/ /g, '')

export default pascalCase
