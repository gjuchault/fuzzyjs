# Fuzzy.js #

Fuzzy.js is a fuzzy search algorithm in javascript

## License ##

Fuzzy.js is licensed under Apache 2 License.

## Usage ##
```js
> var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
> fuzzy(arr, 'scmw');

['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']

> fuzzy(arr, 'w', '', ''); // Highlight chooser

['A sentence composed of multiple words']
```
