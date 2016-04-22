import assert from 'assert';
import fuzzy from '../src/fuzzy';

const testSet = [
    'A sentence composed of multiple Words',
    'a sentence composed of multiple words',
    'Set syntax Javascript'
];

describe('fuzzy.js', () => {
    describe('default search', () => {
        it('finds the right string and surrounds it with a span tag', () => {
            const expected = [
                'A sentence composed of multiple Words',
                'a sentence composed of multiple words'
            ];

            const result = fuzzy(testSet, 'scmw');

            assert.deepEqual(result, expected);
        });

        it('should return the full set without query', () => {
            const expected = testSet;

            const result = fuzzy(testSet);

            assert.deepEqual(result, expected);
        });
    });

    describe('custom surrounding tag', () => {
        it('finds the right string and surrounds it with a span tag', () => {
            const expected = [
                'A <strong>s</strong>enten<strong>c</strong>e co<strong>m</strong>posed of multiple <strong>W</strong>ords',
                'a <strong>s</strong>enten<strong>c</strong>e co<strong>m</strong>posed of multiple <strong>w</strong>ords'
            ];

            const result = fuzzy(testSet, 'scmw', {
                caseSensitive: false,
                before       : '<strong>',
                after        : '</strong>'
            });

            assert.deepEqual(result, expected);
        });
    });

    describe('case sensitive search', () => {
        it('finds only the lower case letter', () => {
            const expected = [
                'a sentence composed of multiple words'
            ];

            const result = fuzzy(testSet, 'w', {
                caseSensitive: true
            });

            assert.deepEqual(result, expected);
        });

        it('finds only the upper case letter', () => {
            const expected = [
                'A sentence composed of multiple Words'
            ];

            const result = fuzzy(testSet, 'W', {
                caseSensitive: true
            });

            assert.deepEqual(result, expected);
        });
    });
});
