import { TestOptions } from './test'
import { prepare } from './utils/prepare'
import { pushRange } from './utils/range'
import { pushScore } from './score/defaultStrategy'
import { isLeading } from './utils/isLeading'

export type MatchOptions = TestOptions & {
  strategy?: ScoreStrategy
  withRanges?: boolean
  withScore?: boolean
}

export type MatchResult = {
  match: boolean
  score: number
  ranges?: Array<MatchRange>
}

export type MatchRange = {
  start: number
  stop: number
}

export type ScoreContext = null | {
  currentScore: number
  character: String
  match: boolean
  leading: boolean
}

export type ScoreStrategy = (previousContext: ScoreContext, context: ScoreContext) => number

export const match = (
  query: string,
  source: string,
  opts: MatchOptions = { withScore: true, strategy: pushScore }
): MatchResult => {
  const [reshapedQuery, reshapedSource] = prepare(query, source, opts)

  // if no source, then only return true if query is also empty
  if (!reshapedSource.length || !reshapedQuery.length) {
    const result: MatchResult = { match: !query.length, score: Number(!query.length) }

    if (opts.withRanges)
      result.ranges = !query.length ? [{ start: 0, stop: reshapedSource.length }] : []

    return result
  }

  // a bigger query than source will always return false
  if (reshapedQuery.length > reshapedSource.length) {
    const result: MatchResult = { match: false, score: 0 }

    if (opts.withRanges) result.ranges = []

    return result
  }

  let queryPos = 0
  let sourcePos = 0
  let score = 0
  let lastContext: ScoreContext = null
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

      console.log(
        `letter: ${source[sourcePos]} prevScore: ${score} newScore: ${pushScore(
          lastContext,
          newContext
        )}`
      )
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
    const result: MatchResult = { match: true, score }

    if (opts.withRanges) result.ranges = ranges

    return result
  }

  return { match: false, score: 0 }
}
