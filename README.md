# fuzzyjs #

[![Build Status](https://travis-ci.org/gjuchault/fuzzyjs.svg?branch=master)](https://travis-ci.org/gjuchault/fuzzyjs)
[![Coverage Status](https://coveralls.io/repos/github/gjuchault/fuzzyjs/badge.svg?branch=master)](https://coveralls.io/github/gjuchault/fuzzyjs?branch=master)

fuzzyjs is a fuzzy search algorithm in javascript.

## License ##

fuzzyjs is licensed under MIT License.

## Usage ##
```js
// Basic true/false test
fuzzy.test('li', 'lorem ipsum'); // true
fuzzy.test('li', 'Lorem ipsum', true); // false

// Advanced match with surrounding and score
fuzzy.match('li', 'lorem ipsum');
// { score: 0.2857, result: 'lorem ipsum' }

fuzzy.match('Li', 'Lorem ipsum', {
    caseSensitive: true,
    before: '<span>',
    after: '</span>'
});
// { score: 0.2857, result: '<span>L</span>orem <span>i</span>psum' }

// Filter an array using match (array is sorted based on score)
const arr = ['lorem ipsum', 'foo', 'the li element'];
fuzzy.filter('li', arr, { caseSensitive: true, before: '<span>', after: '</span>' });
/*
[
    'the <span>l</span><span>i</span> element',
    '<span>l</span>orem <span>i</span>psum'
]
*/
```
