# Fuzzy.js #

Fuzzy.js is a fuzzy search algorithm in javascript. It fits in 577 bytes compressed (~400 bytes gzipped).

## License ##

Fuzzy.js is licensed under Apache 2 License.

## Usage ##
```js
> var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
> fuzzy(arr, 'scmw');

['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']

> fuzzy(arr, 'w', true, '', ''); // Case-sensitive & highlight chooser

['A sentence composed of multiple words']
```
