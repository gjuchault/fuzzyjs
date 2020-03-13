import { test, TestOptions } from './test'
import { match, MatchOptions } from './match'

/**
 * This represents an accessor as used with `sourceAccessor` and `idAccessor`.
 */
export type Accessor<T> = (source: T) => string

/**
 * This represents filter util options. It is based on [[TestOptions]] (as
 * filter is using test) and extends it with `sourceAccessor` when you filter
 * over an object array.
 */
export interface FilterOptions<T> extends TestOptions {
  sourceAccessor?: Accessor<T>
}

/**
 * This represents sort util options. It is based on [[MatchOptions]] (as sort
 * is using match) and extends it with `sourceAccessor` when you filter over an
 * object array and `idAccessor` when you want to optimize the sort with
 * memoization.
 */
export interface SortOptions<T> extends MatchOptions {
  sourceAccessor?: Accessor<T>
  idAccessor?: Accessor<T>
}

/**
 * @ignore
 */
const get = <T>(source: T, accessor?: Accessor<T>): string => {
  if (typeof accessor === 'function') return accessor(source)
  if (typeof source === 'string') return source

  throw new TypeError(`Unexpected array of ${typeof source}. Use an accessor to return a string`)
}

/**
 * This array helper can be used as an `Array.prototype.filter` callback as it
 * will return true or false when passing it a source string. The only
 * difference with `test` is that you can use it with an object, as long as you
 * give a `sourceAccessor` in options.
 *
 * @param query The input query
 * @param options The options as defined in [[FilterOptions]]
 * @returns A function that you can pass into `Array.prototype.filter`
 */
export const filter = <T>(query: string, options: FilterOptions<T> = {}) => (source: T) =>
  test(query, get(source, options.sourceAccessor), options)

/**
 * This array helper can be used as an `Array.prototype.sort` callback as it
 * will return `-1`/`0`/`1` when passing it two source strings. It is based on
 * match with default options set (`withRanges` to false and `withScore` to
 * true). You can also use `sourceAccessor` if you intend to sort over an array
 * of objects and `idAccessor` to optimize the performances.
 *
 * @param query The input query
 * @param options The options as defined in [[SortOptions]]
 * @returns A function that you can pass into `Array.prototype.sort`
 */
export const sort = <T>(query: string, options: SortOptions<T> = {}) => {
  const matchOptions: MatchOptions = {
    ...options,
    withRanges: false,
    withScore: true
  }

  if (!options.idAccessor) {
    return (leftSource: T, rightSource: T) => {
      const leftScore = match(query, get(leftSource, options.sourceAccessor), matchOptions).score!
      const rightScore = match(query, get(rightSource, options.sourceAccessor), matchOptions).score!

      if (rightScore === leftScore) return 0
      return rightScore > leftScore ? 1 : -1
    }
  }

  const memo: { [key: string]: number } = {}

  return (leftSource: any, rightSource: any) => {
    const leftId = get(leftSource, options.idAccessor)
    const rightId = get(rightSource, options.idAccessor)

    const leftScore: number = memo.hasOwnProperty(leftId)
      ? memo[leftId]
      : match(query, get(leftSource, options.sourceAccessor), matchOptions).score!

    const rightScore: number = memo.hasOwnProperty(rightId)
      ? memo[rightId]
      : match(query, get(rightSource, options.sourceAccessor), matchOptions).score!

    if (!memo.hasOwnProperty(leftId)) {
      memo[leftId] = leftScore
    }

    if (!memo.hasOwnProperty(rightId)) {
      memo[rightId] = rightScore
    }

    if (rightScore === leftScore) return 0
    return rightScore > leftScore ? 1 : -1
  }
}
