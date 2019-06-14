import { surround } from '../src/surround'

describe('surround()', () => {
  describe('given an invalid source', () => {
    it('throws a TypeError', () => {
      expect(() => surround(1 as any, null as any)).toThrow(TypeError)
      expect(() => surround(null as any, null as any)).toThrow(TypeError)
    })
  })

  describe('given an empty source', () => {
    it('returns an empty result whatever the options are', () => {
      expect(surround('', null as any)).toBe('')
      expect(surround('', {} as any)).toBe('')
    })
  })

  describe('given an empty range set', () => {
    it('returns the input', () => {
      expect(surround('foo', { result: {} as any, prefix: '<' })).toBe('foo')
      expect(surround('foo', { result: { ranges: [] }, prefix: '<' })).toBe('foo')
    })
  })

  describe('given a source and a range set', () => {
    it('returns the surrounded result', () => {
      expect(
        surround('foo bar', {
          result: {
            ranges: [{ start: 0, stop: 1 }, { start: 4, stop: 6 }]
          },
          prefix: '<strong>',
          suffix: '</strong>'
        })
      ).toBe('<strong>f</strong>oo <strong>ba</strong>r')

      expect(
        surround('foo bar', {
          result: {
            ranges: [{ start: 0, stop: 1 }, { start: 4, stop: 6 }]
          },
          prefix: '*'
        })
      ).toBe('*foo *bar')

      expect(
        surround('foo bar', {
          result: {
            ranges: [{ start: 0, stop: 1 }, { start: 4, stop: 6 }]
          },
          suffix: '*'
        })
      ).toBe('f*oo ba*r')
    })
  })
})
