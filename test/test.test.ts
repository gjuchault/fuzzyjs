import { test } from '../src'

describe('test()', () => {
  describe('given an invalid query', () => {
    it('throws a TypeError', () => {
      expect(() => test(null as any, 'foo')).toThrow(TypeError)
      expect(() => test(1 as any, 'foo')).toThrow(TypeError)
      expect(() => test(NaN as any, 'foo')).toThrow(TypeError)
      expect(() => test(undefined as any, 'foo')).toThrow(TypeError)

      expect(() => test('foo', null as any)).toThrow(TypeError)
      expect(() => test('foo', 1 as any)).toThrow(TypeError)
      expect(() => test('foo', NaN as any)).toThrow(TypeError)
      expect(() => test('foo', undefined as any)).toThrow(TypeError)
    })
  })

  describe('given no query', () => {
    it('returns true', () => {
      expect(test('', 'anything')).toBe(true)
    })
  })

  describe('given no source provided', () => {
    it('returns false', () => {
      expect(test('foo', '')).toBe(false)
    })

    it('unless both strings are empty', () => {
      expect(test('', '')).toBe(true)
    })
  })

  describe('given a query bigger than source', () => {
    it('returns false', () => {
      expect(test('foo', 'f')).toBe(false)
    })
  })

  describe('given a query matching the source', () => {
    it('returns true', () => {
      expect(test('abc', 'Ananas Banana Caramel')).toBe(true)
      expect(test('abc', 'ananas banana caramel')).toBe(true)
      expect(test('abc', 'abc')).toBe(true)
    })
  })

  describe('given a query with caseSensitive option', () => {
    it('returns true when the query matches the source', () => {
      expect(test('abc', 'ananas banana caramel', { caseSensitive: true })).toBe(true)
    })

    it('returns false otherwise', () => {
      expect(test('abc', 'Ananas Banana Caramel', { caseSensitive: true })).toBe(false)
    })
  })

  describe('given a non-ASCII query and an ASCII source', () => {
    it('returns true when the query matches the source', () => {
      expect(test('föÔ', 'foo')).toBe(true)
    })

    it('returns false otherwise', () => {
      expect(test('föÔ', 'foz')).toBe(false)
    })
  })

  describe('given an ASCII query and a non-ASCII source', () => {
    it('returns true when the query matches the source', () => {
      expect(test('foo', 'föÔ')).toBe(true)
    })

    it('returns false otherwise', () => {
      expect(test('foz', 'föÔ')).toBe(false)
    })
  })

  describe('given a non-ASCII query and a non-ASCII source', () => {
    it('returns true when the query matches the source', () => {
      expect(test('fôö', 'föô')).toBe(true)
    })
  })
})
