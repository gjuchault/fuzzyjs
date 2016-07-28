import { pushRange } from '../src/utils/range'
import { MatchRange } from '../src/match'

describe('pushRange()', () => {
  describe('given an empty match range and a position', () => {
    it('pushes the position', () => {
      const source: Array<MatchRange> = []
      const result = pushRange(source, 5)

      expect(result).toMatchObject([{ start: 5, stop: 6 }])
    })
  })

  describe('given a match range and a position', () => {
    it('pushes the position', () => {
      const source: Array<MatchRange> = [{ start: 0, stop: 1 }]
      const result = pushRange(source, 5)

      expect(result).toMatchObject([{ start: 0, stop: 1 }, { start: 5, stop: 6 }])
    })
  })

  describe('given a match range nearby and a position', () => {
    it("pushes the previous position's stop property", () => {
      const source = pushRange([], 4)
      const result = pushRange(source, 5)

      expect(result).toMatchObject([{ start: 4, stop: 6 }])
    })
  })
})
