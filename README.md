# fuzzyjs #

[![Build Status](https://travis-ci.org/gjuchault/fuzzyjs.svg?branch=master)](https://travis-ci.org/gjuchault/fuzzyjs)
[![Coverage Status](https://coveralls.io/repos/github/gjuchault/fuzzyjs/badge.svg?branch=master)](https://coveralls.io/github/gjuchault/fuzzyjs?branch=master)

fuzzyjs is a fuzzy search algorithm in javascript. It fits in 577 bytes compressed (~400 bytes gzipped).

## License ##

fuzzyjs is licensed under MIT License.

## Usage ##
```js
const arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
fuzzy(arr, 'scmw');

['A sentence composed of multiple words']

fuzzy(arr, 'w', {
    caseSensitive: true,
    before: '<span>',
    after: '</span>'
});

['A sentence composed of multiple <span>w</span>ords']
```
