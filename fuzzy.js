// Fuzzy.js
// Writen by Extaze
// Released under Apache 2 license

/*

Usage :
> var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
> fuzzy(arr, 'scmw');

['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']

> fuzzy(arr, 'w', '', ''); // Highlight chooser

['A sentence composed of multiple words']
*/

// Improved from Bulat Bochkariov's version (http://www.quora.com/Algorithms/How-is-the-fuzzy-search-algorithm-in-Sublime-Text-designed)
;(function (window) {
    window.fuzzy = function (searchSet, query, surroundBefore, surroundAfter) {
        if (!query) return searchSet;
        if (surroundBefore === undefined || surroundAfter === undefined) {
            surroundBefore = '<span>';
            surroundAfter = '</span>';
        }

        var tokens = query.toLowerCase().split(''),
            matches = [];
    
        // Better use forEach here, length may be invalid
        searchSet.forEach(function (string) {
            var tokenIndex = 0,
                stringIndex = 0,
                matchWithHighlights = '',
                matchedPositions = [],
                stringLC = string.toLowerCase();
    
            while (stringIndex < string.length) {
                if (stringLC[stringIndex] === tokens[tokenIndex]) {
                    matchWithHighlights += surroundBefore + string[stringIndex] + surroundAfter;
                    matchedPositions.push(stringIndex);
                    tokenIndex++;
    
                    if (tokenIndex >= tokens.length) {
                        matches.push(matchWithHighlights + string.slice(stringIndex + 1));
                        break;
                    }
                }
                else {
                    matchWithHighlights += string[stringIndex];
                }
    
                stringIndex++;
            }
        });

        if (surroundBefore) {
            matches = matches.sort(function (a, b) {
                var scoreA = a.split(surroundBefore).length - 1
                    scoreB = b.split(surroundBefore).length - 1;

                return (scoreA > scoreB) ? 1 : (scoreB > scoreA) ? -1 : 0;
            });
        }

        return matches;
    }
}(window));
