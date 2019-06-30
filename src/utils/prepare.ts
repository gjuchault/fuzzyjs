import { TestOptions } from '../test'

/**
 * This functions is used to throw when query or source is not defined as well
 * as normalizing and lower casing the input strings.
 *
 * @param query The fuzzy query string
 * @param source The fuzzy source string
 * @param opts An options object that can contains `caseSensitive`
 * @returns The reshaped query string and the reshaped source string.
 */
export const prepare = (query: string, source: string, opts: TestOptions) => {
  if (typeof query !== 'string') {
    throw new TypeError('Expecting query to be a string')
  }

  if (typeof source !== 'string') {
    throw new TypeError('Expecting source to be a string')
  }

  let reshapedQuery = query
  let reshapedSource = source

  if (!opts.caseSensitive) {
    reshapedQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    reshapedSource = source
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  return [reshapedQuery, reshapedSource]
}
