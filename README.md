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
{ match: true, score: 22 }

match('ssjav', 'Set Syntax: JavaScript', { withScore: false, withRanges: true })
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
  withScore?: boolean // (default: true)
}

type MatchResult = {
  match: boolean
  score?: number
  ranges?: MatchRange[]
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
    ranges: MatchRange[]
  }
  prefix?: string // (default: '')
  suffix?: string // (default: '')
}
```

**`filter`**

Can be used as a [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) callback.
You can use the `sourceAccessor` option if you pass an array of objects that contains the string you want to match.

```ts
import { filter as fuzzy } from 'fuzzyjs'

const sources = ['Set Syntax: JavaScript', 'Set Syntax: CSS', 'Set Syntax: HTML']

sources.filter(fuzzy('ssjs'))
[ 'Set Syntax: JavaScript' ]

const sources = [
  { name: { foo: 'Set Syntax: JavaScript' } },
  { name: { foo: 'Set Syntax: CSS' } },
  { name: { foo: 'Set Syntax: HTML' } }
]

sources.filter(fuzzy('ssjs', { sourceAccessor: source => source.name.foo }))
[ { name: { foo: 'Set Syntax: JavaScript' } } ]
```

```ts
const filter: (query: string, options?: FilterOptions) => (source: any) => boolean

type FilterOptions = TestOptions & {
  sourceAccessor?: (source: any) => string
}
```

**`sort`**

Can be used as a [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) callback.
If you have a large array of objects, you might want to pass `idAccessor` as it creates a [memoization](https://en.wikipedia.org/wiki/Memoization) table which reduces drastically how many times the fuzzy matching algorithm will be called.

```ts
import { sort as fuzzy } from 'fuzzyjs'

const sources = ['Set Syntax: CSS', 'Set Syntax: HTML', 'Set Syntax: JavaScript']

sources.sort(fuzzy('ssjs'))
[ 'Set Syntax: JavaScript', 'Set Syntax: CSS', 'Set Syntax: HTML' ]

const sources = [
  { name: { id: 0, foo: 'Set Syntax: CSS' } },
  { name: { id: 1, foo: 'Set Syntax: HTML' } },
  { name: { id: 2, foo: 'Set Syntax: JavaScript' } }
]

sources.sort(fuzzy('ssjs', { sourceAccessor: source => source.name.foo }))
[
  { name: { id: 2, foo: 'Set Syntax: JavaScript' } },
  { name: { id: 0, foo: 'Set Syntax: CSS' } },
  { name: { id: 1, foo: 'Set Syntax: HTML' } }
]

// same, but will be faster thanks to memoization
sources.sort(fuzzy('ssjs', { sourceAccessor: source => source.name.foo, idAccessor: source => source.name.id }))
[
  { name: { id: 2, foo: 'Set Syntax: JavaScript' } },
  { name: { id: 0, foo: 'Set Syntax: CSS' } },
  { name: { id: 1, foo: 'Set Syntax: HTML' } }
]
```

```ts
const sort: (query: string, options?: SortOptions) => (leftSource: any, rightSource: any) => 0 | 1 | -1

type SortOptions = MatchOptions & {
  sourceAccessor?: Accessor // used as an accessor if array is made of objects
  idAccessor?: Accessor // used as an accessor if you want fuzzy to be memoized
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
