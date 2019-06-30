import { TestOptions } from './test'
import { prepare } from './utils/prepare'
import { pushRange } from './utils/range'
import { pushScore } from './score/defaultStrategy'
import { isLeading } from './utils/isLeading'

/**
 * This represents match options. It is based on [[TestOptions]] but allows
 * scores and ranges to be returned as well.
 */
export interface MatchOptions extends TestOptions {
  strategy?: ScoreStrategy
  withRanges?: boolean
  withScore?: boolean
}

/**
 * This represents match result as returned by the match function. It will
 * always contains a `match` boolean (which would be equivalent to `test`
 * function). If you set `withRanges` to true, match will return a `ranges`
 * array, and if you set `withScore` to true, match will return a `score`
 * number.
 */
export interface MatchResult {
  match: boolean
  score?: number
  ranges?: MatchRange[]
}

/**
 * This represents a Range that you can get if you call match with `withRanges`
 * set to true. It is composed of indexes of the source string that are matched
 * by the input string.
 */
export interface MatchRange {
  start: number
  stop: number
}

/**
 * This represents a score context that the scoring function will use to
 * compute the new score. It must include:
 *   - `currentScore` the actual score (ie. the result of the last `pushScore` call or 0)
 *   - `character` the actual source character. It must not be reshaped (ie. lowercased or normalized)
 *   - `match` wether or not the actual source character is matched by the query
 *   - `leading` wether or not the actual source character is a leading character (as returned by the `isLeading` function)
 */
export interface ScoreContext {
  currentScore: number
  character: string
  match: boolean
  leading: boolean
}

/**
 * This represents the signature of the `pushScore` function. It requires the
 * previous context as long as the actual one (as we want to check for
 * concurrent matches), and returns the new score as a number.
 *
 * The scoring function is not returning a number from 0 to 1 but a whole
 * natural number.
 */
export type ScoreStrategy = (previousContext: ScoreContext | null, context: ScoreContext) => number

/**
 * Returns wether or not the query fuzzy matches the source. Called without
 * options would be strictly equivalent as `{ match: test(query, source) }` but
 * less optimized. You should use `withScore` or `withRanges` options to get
 * additional informations about the match.
 *
 * @param query The input query
 * @param source The input source
 * @param opts Options as defined by [[MatchOptions]]
 * @returns An object as defined by [[MatchResult]]
 */
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
  let ranges: MatchRange[] = []

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
