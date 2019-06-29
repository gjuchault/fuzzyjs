import { filter, sort } from '../src/array'

describe('Array helpers', () => {
  describe('filter()', () => {
    describe('given a query', () => {
      it('should return a Array.prototype compatible callback', () => {
        const sources = ['Set Syntax: JavaScript', 'Set Syntax: CSS', 'Set Syntax: HTML']

        expect(sources.filter(filter('ssjs'))).toMatchObject([sources[0]])
        expect(sources.filter(filter('ssjs', { caseSensitive: true }))).toMatchObject([])
        expect(sources.filter(filter('SSJS', { caseSensitive: true }))).toMatchObject([sources[0]])
      })
    })

    describe('given a query and a sourceAccessor', () => {
      it('should return an Array.prototype compatible callback', () => {
        const sources = [
          { foo: { name: 'Set Syntax: JavaScript' } },
          { foo: { name: 'Set Syntax: CSS' } },
          { foo: { name: 'Set Syntax: HTML' } }
        ]

        expect(
          sources.filter(filter('ssjs', { sourceAccessor: source => source.foo.name }))
        ).toMatchObject([sources[0]])
        expect(
          sources.filter(
            filter('ssjs', { caseSensitive: true, sourceAccessor: source => source.foo.name })
          )
        ).toMatchObject([])
        expect(
          sources.filter(
            filter('SSJS', { caseSensitive: true, sourceAccessor: source => source.foo.name })
          )
        ).toMatchObject([sources[0]])
      })
    })
  })

  describe('sort()', () => {
    describe('given a query and no idAccessor', () => {
      it('should return an Array.prototype compatible callback, non optimized', () => {
        const sources = ['Set Syntax: HTML', 'Set Syntax: css', 'Set Syntax: JavaScript']

        expect(sources.sort(sort('sss'))).toMatchObject([
          'Set Syntax: JavaScript',
          'Set Syntax: css',
          'Set Syntax: HTML'
        ])
      })
    })

    describe('given a query and an idAccessor options', () => {
      it('should return an Array.prototype compatible callback, optimized', () => {
        const sources = [
          { id: 'Set Syntax: Rust' },
          { id: 'Set Syntax: HTML' },
          { id: 'Set Syntax: css' },
          { id: 'Set Syntax: JavaScript' },
          { id: 'Set Syntax: YAML' },
          { id: 'Set Syntax: C++' },
          { id: 'Set Syntax: Diff' },
          { id: 'Set Syntax: Rust' }
        ]

        expect(sources.sort(sort('sss', { sourceAccessor: source => source.id }))).toMatchObject([
          { id: 'Set Syntax: JavaScript' },
          { id: 'Set Syntax: css' },
          { id: 'Set Syntax: Rust' },
          { id: 'Set Syntax: Rust' },
          { id: 'Set Syntax: HTML' },
          { id: 'Set Syntax: YAML' },
          { id: 'Set Syntax: C++' },
          { id: 'Set Syntax: Diff' }
        ])

        expect(
          sources.sort(
            sort('sss', { sourceAccessor: source => source.id, idAccessor: source => source.id })
          )
        ).toMatchObject([
          { id: 'Set Syntax: JavaScript' },
          { id: 'Set Syntax: css' },
          { id: 'Set Syntax: Rust' },
          { id: 'Set Syntax: Rust' },
          { id: 'Set Syntax: HTML' },
          { id: 'Set Syntax: YAML' },
          { id: 'Set Syntax: C++' },
          { id: 'Set Syntax: Diff' }
        ])
      })
    })
  })
})
