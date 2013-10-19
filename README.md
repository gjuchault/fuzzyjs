fuzzy.js
========

Fuzzy.js is a fuzzy search algorithm in javascript

Usage
=====
var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];

```js
fuzzy(arr, 'scmw');
["A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords"]
```

```js
fuzzy(arr, 's');
["A <span>s</span>entence composed of multiple words", "<span>S</span>et syntax Javscript"]
```
