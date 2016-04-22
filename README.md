# Fuzzy.js #

Fuzzy.js is a fuzzy search algorithm in javascript. It fits in 577 bytes compressed (~400 bytes gzipped).

## License ##

Fuzzy.js is licensed under MIT License.

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
