import assert from 'assert';
import fuzzy from '../src/fuzzy';

describe('fuzzyjs', () => {
    describe('test', () => {
        it('should return -1 if no query', () => {
            const str      = 'foo';
            const q        = null;
            const expected = -1;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should return -1 if no string to test', () => {
            const str      = null;
            const q        = 'foo';
            const expected = -1;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should return -1 if string is empty', () => {
            const str      = '';
            const q        = 'foo';
            const expected = -1;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should return true if query is empty', () => {
            const str      = 'foo';
            const q        = '';
            const expected = true;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should match when the pattern matches', () => {
            const str      = 'lorem ipsum';
            const q        = 'li';
            const expected = true;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should not match when the pattern does not match', () => {
            const str      = 'lorem ipsum';
            const q        = 'foo';
            const expected = false;

            const result = fuzzy.test(q, str);

            assert.equal(expected, result);
        });

        it('should match with caseSensitive set to true and pattern matching', () => {
            const str      = 'Lorem ipsum';
            const q        = 'Li';
            const expected = true;

            const result = fuzzy.test(q, str, true);

            assert.equal(expected, result);
        });

        it('should not match with caseSensitive set to true and pattern not matching', () => {
            const str      = 'Lorem ipsum';
            const q        = 'li';
            const expected = false;

            const result = fuzzy.test(q, str, true);

            assert.equal(expected, result);
        });
    });

    describe('match', () => {
        it('should return { score: 0, result: str } if no query', () => {
            const str = 'foo';
            const q   = null;

            const expectedScore  = 0;
            const expectedResult = 'foo';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should return { score: 0, result: str } if no string to match', () => {
            const str = null;
            const q   = 'foo';

            const expectedScore  = 0;
            const expectedResult = null;

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should return { score: 0, result: str } if string is empty', () => {
            const str = '';
            const q   = 'foo';

            const expectedScore  = 0;
            const expectedResult = '';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should return { score: 1, result: str } if query is empty', () => {
            const str = 'foo';
            const q   = '';

            const expectedScore  = 1;
            const expectedResult = 'foo';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should match when the pattern matches', () => {
            const str = 'lorem ipsum';
            const q   = 'li';

            const expectedScore  = 'li'.length / (6 + 1);
            const expectedResult = 'lorem ipsum';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should scores 1 when the pattern is equal to the string', () => {
            const str = 'lorem ipsum';
            const q   = 'lorem ipsum';

            const expectedScore  = 1;
            const expectedResult = 'lorem ipsum';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should not match when the pattern does not match', () => {
            const str = 'lorem ipsum';
            const q   = 'foo';

            const expectedScore  = 0;
            const expectedResult = 'lorem ipsum';

            const result = fuzzy.match(q, str);

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should match with caseSensitive set to true and pattern matching', () => {
            const str = 'Lorem ipsum';
            const q   = 'Li';

            const expectedScore  = 'li'.length / (6 + 1);
            const expectedResult = 'Lorem ipsum';

            const result = fuzzy.match(q, str, { caseSensitive: true });

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should not match with caseSensitive set to true and pattern not matching', () => {
            const str = 'Lorem ipsum';
            const q   = 'li';

            const expectedScore  = 0;
            const expectedResult = 'Lorem ipsum';

            const result = fuzzy.match(q, str, { caseSensitive: true });

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });

        it('should surround with options', () => {
            const str = 'lorem ipsum';
            const q   = 'li';

            const expectedScore  = 'li'.length / (6 + 1);
            const expectedResult = '<span>l</span>orem <span>i</span>psum';

            const result = fuzzy.match(q, str, { before: '<span>', after: '</span>' });

            assert.equal(expectedScore, result.score);
            assert.equal(expectedResult, result.result);
        });
    });

    describe('filter', () => {
        it('should return the original set if no query', () => {
            const arr = ['lorem ipsum', 'foo', 'the li element'];
            const q   = '';

            const expected = ['lorem ipsum', 'foo', 'the li element'];

            const result = fuzzy.filter(q, arr);

            assert.deepEqual(expected, result);
        });

        it('should return the original set if invalid query', () => {
            const arr = ['lorem ipsum', 'foo', 'the li element'];
            const q   = null;

            const expected = ['lorem ipsum', 'foo', 'the li element'];

            const result = fuzzy.filter(q, arr);

            assert.deepEqual(expected, result);
        });

        it('should return an empty array if invalid set', () => {
            const arr = null;
            const q   = '';

            const expected = [];

            const result = fuzzy.filter(q, arr);

            assert.deepEqual(expected, result);
        });

        it('should filter an array based on pattern', () => {
            const arr = ['lorem ipsum', 'foo', 'the li element'];
            const q   = 'li';

            const expected = ['the li element', 'lorem ipsum'];

            const result = fuzzy.filter(q, arr);

            assert.deepEqual(expected, result);
        });
    });
});
