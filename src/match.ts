import { TestOptions } from './test'
import { prepare } from './utils/prepare'
import { pushRange } from './utils/range'
import { pushScore } from './score/defaultStrategy'
import { isLeading } from './utils/isLeading'

export interface MatchOptions extends TestOptions {
  strategy?: ScoreStrategy
  withRanges?: boolean
  withScore?: boolean
}

export interface MatchResult {
  match: boolean
  score?: number
  ranges?: Array<MatchRange>
}

export interface MatchRange {
  start: number
  stop: number
}

export interface ScoreContext {
  currentScore: number
  character: string
  match: boolean
  leading: boolean
}

export type ScoreStrategy = (previousContext: ScoreContext | null, context: ScoreContext) => number

export const match = (
  query: string,
  source: string,
  opts: MatchOptions = { withScore: true, strategy: pushScore }
): MatchResult => {
  const [reshapedQuery, reshapedSource] = prepare(query, source, opts)

  // if no source, then only return true if query is also empty
  if (!reshapedSource.length || !reshapedQuery.length) {
    const result: MatchResult = { match: !query.length }

    if (opts.withRanges)
      result.ranges = !query.length ? [{ start: 0, stop: reshapedSource.length }] : []
    if (opts.withScore) result.score = Number(!query.length)

    return result
  }

  // a bigger query than source will always return false
  if (reshapedQuery.length > reshapedSource.length) {
    const result: MatchResult = { match: false, score: 0 }

    if (opts.withRanges) result.ranges = []
    if (opts.withScore) result.score = 0

    return result
  }

  let queryPos = 0
  let sourcePos = 0
  let score = 0
  let lastContext: ScoreContext | null = null
  let ranges: Array<MatchRange> = []

  // loop on source string
  while (sourcePos < source.length) {
    const actualSourceCharacter = reshapedSource[sourcePos]
    const queryCharacterWaitingForMatch = reshapedQuery[queryPos]
    const match = actualSourceCharacter === queryCharacterWaitingForMatch

    if (opts.withScore) {
      // context does not use reshaped as uppercase changes score
      const previousCharacter = sourcePos > 0 ? source[sourcePos - 1] : ''

      const newContext: ScoreContext = {
        currentScore: score,
        character: source[sourcePos],
        match,
        leading: isLeading(previousCharacter, source[sourcePos])
      }

      score = pushScore(lastContext, newContext)

      lastContext = newContext
    }

    // if actual query character matches source character
    if (match) {
      // push range to result
      if (opts.withRanges) {
        ranges = pushRange(ranges, sourcePos)
      }

      // move query pos
      queryPos += 1
    }

    sourcePos += 1
  }

  if (queryPos === reshapedQuery.length) {
    const result: MatchResult = { match: true }

    if (opts.withRanges) result.ranges = ranges
    if (opts.withScore) result.score = score

    return result
  }

  const result: MatchResult = { match: false }

  if (opts.withRanges) result.ranges = []
  if (opts.withScore) result.score = 0

  return result
}
