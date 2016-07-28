import { pushScore } from '../src/score/defaultStrategy'

describe('pushScore()', () => {
  describe('given an invalid context', () => {
    it('throws a TypeError', () => {
      expect(() => pushScore(undefined as any, undefined as any)).toThrow(TypeError)
      expect(() => pushScore(null, null)).toThrow(TypeError)
    })
  })

  describe('given a non-matching context', () => {
    it('returns a decreased score', () => {
      expect(
        pushScore(null, {
          currentScore: 0,
          match: false,
          character: 'f',
          leading: false
        })
      ).toBe(-1)
    })
  })

  describe('given a matching context', () => {
    it('returns the same score', () => {
      expect(
        pushScore(null, {
          currentScore: 0,
          match: true,
          character: 'f',
          leading: false
        })
      ).toBe(0)
    })
  })

  describe('given a matching leading context', () => {
    it('returns an increased score', () => {
      expect(
        pushScore(null, {
          currentScore: 0,
          match: true,
          character: 'F',
          leading: true
        })
      ).toBe(10)
    })
  })

  describe('given a previous context with a consecutive match', () => {
    it('returns an increased score', () => {
      expect(
        pushScore(
          {
            currentScore: 0,
            match: true,
            character: 'f',
            leading: false
          },
          {
            currentScore: 0,
            match: true,
            character: 'f',
            leading: false
          }
        )
      ).toBe(5)
    })
  })
})
