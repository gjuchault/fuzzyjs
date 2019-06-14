# fuzzyjs

[![Build Status](https://travis-ci.org/gjuchault/fuzzyjs.svg?branch=master)](https://travis-ci.org/gjuchault/fuzzyjs)	
[![Coverage Status](https://coveralls.io/repos/github/gjuchault/fuzzyjs/badge.svg?branch=master)](https://coveralls.io/github/gjuchault/fuzzyjs?branch=master)

fuzzyjs is a fuzzy search algorithm in javascript.

## Usage

**`test`**

Tests a query against a source using fuzzy matching

```ts
import { test } from 'fuzzyjs'

test('ssjs', 'Set Syntax: JavaScript')
true
```

```ts
const test: (query: string, source: string, opts?: TestOptions) => boolean

type TestOptions = {
  caseSensitive: boolean // (default: false)
}
```

**`match`**

Matches a query against a source using fuzzy matching, returns information about the result

```ts
import { match } from 'fuzzyjs'

match('ssjs', 'Set Syntax: JavaScript')
{ match: true }

match('ssjs', 'Set Syntax: JavaScript', { withScore: true })
{ match: true, score: 22 }

match('ssjav', 'Set Syntax: JavaScript', { withRanges: true })
{
  match: true,
  ranges: [
    { start: 0, stop: 1 },
    { start: 4, stop: 5 },
    { start: 12, stop: 15 }
  ]
}
```

```ts
const match: (query: string, source: string, opts?: MatchOptions) => MatchResult

type MatchOptions = TestOptions & {
  strategy?: ScoreStrategy // (default: see below)
  withRanges?: boolean // (default: false)
  withScore?: boolean // (default: false)
}

type MatchResult = {
  match: boolean
  score?: number
  ranges?: Array<MatchRange>
}
```

## Utilities

**`surround`**

Surround parts of the string that matched with prefix and suffix

```ts
import { match, surround } from 'fuzzyjs'

const result = match('ssjav', 'Set Syntax: JavaScript', { withRanges: true })

surround(
  'Set Syntax: JavaScript',
  {
    result,
    prefix: '<strong>',
    suffix: '</strong>'
  }
)
'<strong>S</strong>et <strong>S</strong>yntax: <strong>Jav</strong>aScript'
```

```ts
const surround: (source: string, options: SurroundOptions) => string

type SurroundOptions = {
  result: {
    ranges: Array<MatchRange>
  }
  prefix?: string // (default: '')
  suffix?: string // (default: '')
}
```

## Scoring function

A scoring function is a function that given two context, returns a number (either positive or negative) that will be added the the match score.

A leading character is a character that matters more than others.
These are made of capitals and letters follwoing `-_ ./\`.

```ts
const pushScore: (previousContext: ScoreContext, context: ScoreContext) => number

type ScoreContext = {
  currentScore: number // the current match score
  character: string // the current character
  match: boolean // is the character matching the source string
  leading: boolean // is the character leading
}
```

Link to default strategy: [here](./src/score/defaultStrategy.ts).

## License

fuzzyjs is licensed under MIT License.	
