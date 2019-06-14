import { match } from '../src'

describe('match()', () => {
  describe('given an invalid query', () => {
    it('throws a TypeError', () => {
      expect(() => match(null as any, 'foo')).toThrow(TypeError)
      expect(() => match(1 as any, 'foo')).toThrow(TypeError)
      expect(() => match(NaN as any, 'foo')).toThrow(TypeError)
      expect(() => match(undefined as any, 'foo')).toThrow(TypeError)

      expect(() => match('foo', null as any)).toThrow(TypeError)
      expect(() => match('foo', 1 as any)).toThrow(TypeError)
      expect(() => match('foo', NaN as any)).toThrow(TypeError)
      expect(() => match('foo', undefined as any)).toThrow(TypeError)
    })
  })

  describe('given no query', () => {
    it('returns a truthy match', () => {
      expect(match('', 'anything')).toMatchObject({ match: true })
      expect(match('', 'anything', { withRanges: true })).toMatchObject({
        match: true,
        ranges: [{ start: 0, stop: 8 }]
      })
    })
  })

  describe('given no source provided', () => {
    it('returns a falsy match', () => {
      expect(match('foo', '')).toMatchObject({ match: false })
      expect(match('foo', '', { withRanges: true })).toMatchObject({
        match: false,
        ranges: []
      })
    })

    it('unless both strings are empty', () => {
      expect(match('', '')).toMatchObject({ match: true })
      expect(match('', '', { withRanges: true })).toMatchObject({
        match: true,
        ranges: [{ start: 0, stop: 0 }]
      })
    })
  })

  describe('given a query bigger than source', () => {
    it('returns a falsy match', () => {
      expect(match('foo', 'f')).toMatchObject({ match: false })
      expect(match('foo', 'f', { withRanges: true })).toMatchObject({
        match: false,
        ranges: []
      })
    })
  })

  describe('given a query matching the source', () => {
    it('returns a truthy match', () => {
      expect(match('abc', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 12
      })
      expect(match('abc', 'ananas banana caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 2
      })
      expect(match('abc', 'abc', { withScore: true })).toMatchObject({ match: true, score: 10 })
    })

    it('uses a correct scoring algorithm', () => {
      expect(match('a', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: -10
      })
      expect(match('ab', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 1
      })
      expect(match('abc', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 12
      })
      expect(match('anbaca', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 30
      })
      expect(match('an ba cal', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 43
      })
      expect(match('anabancar', 'Ananas Banana Caramel', { withScore: true })).toMatchObject({
        match: true,
        score: 48
      })
    })

    it('returns ranges of strings that matched', () => {
      expect(match('a', 'Ananas Banana Caramel', { withRanges: true })).toMatchObject({
        match: true,
        ranges: [{ start: 0, stop: 1 }]
      })
      expect(match('ab', 'Ananas Banana Caramel', { withRanges: true })).toMatchObject({
        match: true,
        ranges: [{ start: 0, stop: 1 }, { start: 7, stop: 8 }]
      })
      expect(match('anaba', 'Ananas Banana Caramel', { withRanges: true })).toMatchObject({
        match: true,
        ranges: [{ start: 0, stop: 3 }, { start: 7, stop: 9 }]
      })
    })
  })

  describe('given a query with caseSensitive option', () => {
    it('returns a truthy match when the query matches the source', () => {
      expect(match('abc', 'Ananas Banana Caramel', { caseSensitive: true })).toMatchObject({
        match: false
      })
    })

    it('returns a falsy match otherwise', () => {
      expect(match('abc', 'ananas banana caramel', { caseSensitive: true })).toMatchObject({
        match: true
      })
    })
  })

  describe('a non-matching query', () => {
    it('returns a falsy match', () => {
      expect(match('abc', 'foobar')).toMatchObject({ match: false })
      expect(match('abc', 'foobar', { withScore: true })).toMatchObject({ match: false, score: 0 })
      expect(match('abc', 'foobar', { withRanges: true })).toMatchObject({
        match: false,
        ranges: []
      })
    })
  })
})
