import { MatchRange } from './match'

/**
 * This represents the options you can pass to surround.
 * It requires at least `result` (that you'll get in `match` with the
 * `withRanges` option set to true). You can give a prefix and a suffix, which
 * will surround every part of the source string that matched the query.
 */
export interface SurroundOptions {
  result: {
    ranges: MatchRange[]
  }
  prefix?: string
  suffix?: string
}

/**
 * @ignore
 */
const insertAt = (input: string, index: number, patch: string = '') =>
  input.slice(0, index) + patch + input.slice(index)

/**
 * Surround parts of the string that matched with prefix and suffix.
 * Useful to emphasize the parts that matched.
 *
 * @param source The input source
 * @param options Options as defined by [[SurroundOptions]]
 * @returns The input source with matching ranges surrounded by prefix and suffix
 */
export const surround = (source: string, options: SurroundOptions) => {
  if (typeof source !== 'string') {
    throw new TypeError('Expecting source to be a string')
  }

  if (!source.length) {
    return ''
  }

  if (!options.result.ranges || !options.result.ranges.length) {
    return source
  }

  let result = source
  let accumulator = 0

  for (let range of options.result.ranges) {
    result = insertAt(result, range.start + accumulator, options.prefix)

    accumulator += (options.prefix || '').length

    result = insertAt(result, range.stop + accumulator, options.suffix)

    accumulator += (options.suffix || '').length
  }

  return result
}
