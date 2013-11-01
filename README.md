# Fuzzy.js #

Fuzzy.js is a fuzzy search algorithm in javascript

## License ##

Fuzzy.js is licensed under Apache 2 License.

## Usage ##
```js
> var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
> fuzzy(arr, 'scmw');

['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']

> fuzzy(arr, 'w', true);

['A sentence composed of multiple words']

> fuzzy(arr, 's', false, function (toHighlight) {
    return '<i>' + toHighlight + '</i>';
});

['A <i>s</i>entence composed of multiple words', '<i>S</i>et syntax Javscript']
```
