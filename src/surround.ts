import { MatchRange } from './match'

export type SurroundOptions = {
  result: {
    ranges: Array<MatchRange>
  }
  prefix?: string
  suffix?: string
}

const insertAt = (input: string, index: number, patch: string = '') =>
  input.slice(0, index) + patch + input.slice(index)

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
