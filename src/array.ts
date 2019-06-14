import { get } from 'dot-prop'
import { test, TestOptions } from './test'
import { match, ScoreStrategy, MatchOptions } from './match'

export type FilterOptions = TestOptions & {
  sourcePath?: string
}

export type SortOptions = TestOptions & {
  strategy?: ScoreStrategy
  sourcePath?: string
  idPath?: string
}

export const filter = (query: string, options: FilterOptions = {}) => (source: any) =>
  test(query, get(source, options.sourcePath || ''), options)

export const sort = (query: string, options: SortOptions = {}) => {
  const matchOptions: MatchOptions = {
    caseSensitive: options.caseSensitive,
    strategy: options.strategy,
    withScore: true
  }

  const sourcePath = options.sourcePath || ''

  if (!options.idPath) {
    return (leftSource: any, rightSource: any) => {
      const leftScore = match(query, get(leftSource, sourcePath), matchOptions).score!
      const rightScore = match(query, get(rightSource, sourcePath), matchOptions).score!

      if (rightScore === leftScore) return 0
      return rightScore > leftScore ? 1 : -1
    }
  }

  const memo: { [key: string]: number } = {}

  return (leftSource: any, rightSource: any) => {
    const leftId = get(leftSource, options.idPath!) as string
    const rightId = get(rightSource, options.idPath!) as string

    const leftScore: number = memo.hasOwnProperty(leftId)
      ? memo[leftId]
      : match(query, get(leftSource, sourcePath), matchOptions).score!

    const rightScore: number = memo.hasOwnProperty(rightId)
      ? memo[rightId]
      : match(query, get(rightSource, sourcePath), matchOptions).score!

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
