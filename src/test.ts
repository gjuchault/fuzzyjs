import { prepare } from './utils/prepare'

export type TestOptions = {
  caseSensitive?: boolean
}

export const test = (query: string, source: string, opts: TestOptions = {}) => {
  const [reshapedQuery, reshapedSource] = prepare(query, source, opts)

  // if no source, then only return true if query is also empty
  if (!reshapedSource.length) {
    return !query.length
  }

  if (!reshapedQuery.length) {
    return true
  }

  // a bigger query than source will always return false
  if (reshapedQuery.length > reshapedSource.length) {
    return false
  }

  let queryPos = 0
  let sourcePos = 0

  // loop on source string
  while (sourcePos < source.length) {
    const actualSourceCharacter = reshapedSource[sourcePos]
    const queryCharacterWaitingForMatch = reshapedQuery[queryPos]

    // if actual query character matches source character
    if (actualSourceCharacter === queryCharacterWaitingForMatch) {
      // move query pos
      queryPos += 1
    }

    sourcePos += 1
  }

  return queryPos === reshapedQuery.length
}
