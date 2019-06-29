import { isLeading } from '../src/utils/isLeading'

describe('isLeading()', () => {
  describe('given a leading character', () => {
    it('returns true', () => {
      expect(isLeading('f', 'L')).toBe(true)
      expect(isLeading('f', 'É')).toBe(true)
    })
  })

  describe('given a non-leading character', () => {
    it('returns false', () => {
      expect(isLeading('f', 'f')).toBe(false)
      expect(isLeading('f', ' ')).toBe(false)
      expect(isLeading('f', '-')).toBe(false)
    })
  })

  describe('given a character following a separator', () => {
    it('returns true', () => {
      expect(isLeading('-', 'f')).toBe(true)
    })
  })
})
