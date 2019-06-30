import { test, TestOptions } from './test'
import { match, ScoreStrategy, MatchOptions } from './match'

/**
 * This represents an accessor as used with `sourceAccessor` and `idAccessor`.
 */
export type Accessor = (source: any) => string

/**
 * This represents filter util options. It is based on [[TestOptions]] (as
 * filter is using test) and extends it with `sourceAccessor` when you filter
 * over an object array.
 */
export interface FilterOptions extends TestOptions {
  sourceAccessor?: Accessor
}

/**
 * This represents sort util options. It is based on [[MatchOptions]] (as sort
 * is using match) and extends it with `sourceAccessor` when you filter over an
 * object array and `idAccessor` when you want to optimize the sort with
 * memoization.
 */
export interface SortOptions extends MatchOptions {
  sourceAccessor?: Accessor
  idAccessor?: Accessor
}

/**
 * @ignore
 */
const get = (source: any, accessor?: Accessor): string => {
  return typeof accessor === 'function' ? accessor(source) : source
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
export const filter = (query: string, options: FilterOptions = {}) => (source: any) =>
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
export const sort = (query: string, options: SortOptions = {}) => {
  const matchOptions: MatchOptions = {
    ...options,
    withRanges: false,
    withScore: true
  }

  if (!options.idAccessor) {
    return (leftSource: any, rightSource: any) => {
      const leftScore = match(query, get(leftSource, options.sourceAccessor), matchOptions).score!
      const rightScore = match(query, get(rightSource, options.sourceAccessor), matchOptions).score!

      if (rightScore === leftScore) return 0
      return rightScore > leftScore ? 1 : -1
    }
  }

  const memo: { [key: string]: number } = {}

  return (leftSource: any, rightSource: any) => {
    const leftId = get(leftSource, options.idAccessor) as string
    const rightId = get(rightSource, options.idAccessor) as string

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
