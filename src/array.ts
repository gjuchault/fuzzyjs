import { test, TestOptions } from './test'
import { match, ScoreStrategy, MatchOptions } from './match'

export type Accessor = (source: any) => string

export interface FilterOptions extends TestOptions {
  sourceAccessor?: Accessor
}

export interface SortOptions extends MatchOptions {
  sourceAccessor?: Accessor
  idAccessor?: Accessor
}

const get = (source: any, accessor?: Accessor): string => {
  return typeof accessor === 'function' ? accessor(source) : source
}

export const filter = (query: string, options: FilterOptions = {}) => (source: any) =>
  test(query, get(source, options.sourceAccessor), options)

export const sort = (query: string, options: SortOptions = {}) => {
  const matchOptions: MatchOptions = {
    ...options,
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
