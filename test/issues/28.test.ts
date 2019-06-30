import { test } from '../../src/test'

describe('Issue #28', () => {
  describe('test()', () => {
    describe('given caseSensitive to true and a non-ASCII query', () => {
      it('should match when the query matches the source', () => {
        expect(test('e', 'é', { caseSensitive: true })).toBe(true)
      })
    })
  })
})
