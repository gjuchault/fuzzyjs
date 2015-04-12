// Fuzzy.js
// Written by Gabriel Juchault
// Released under MIT license

/*

Usage :
> var arr = ['A sentence composed of multiple words', 'Set syntax JavaScript'];
> fuzzy(arr, 'scmw');

['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']

> fuzzy(arr, 'w', true, '', ''); // Case-sensitive and highlight chooser

['A sentence composed of multiple words']
*/

// Improved from Bulat Bochkariov's version (http://www.quora.com/Algorithms/How-is-the-fuzzy-search-algorithm-in-Sublime-Text-designed)
;(function (window) {
    window.fuzzy = function (searchSet, query, caseSensitive, surroundBefore, surroundAfter) {
        if (!query) return searchSet;
        if (caseSensitive === undefined) {
            caseSensitive = false;
        }
        if (surroundBefore === undefined || surroundAfter === undefined) {
            surroundBefore = '<span>';
            surroundAfter = '</span>';
        }

        var tokens = (caseSensitive) ? query.split('') : query.toLowerCase().split(''),
            i = 0,
            l = searchSet.length,
            matches = [];
    
        for (i; i < l; i++) {
            // tokenIndex          : query letter index
            // stringIndex         : current possible result letter index
            // matchWithHighlights : string containing result
            // stringLC            : lower-case search, or not
            var tokenIndex = 0,
                stringIndex = 0,
                matchWithHighlights = '',
                matchedPositions = [],
                stringLC = (caseSensitive) ? searchSet[i] : searchSet[i].toLowerCase();
    
            while (stringIndex < searchSet[i].length) {
                // [Still] same letter
                if (stringLC[stringIndex] === tokens[tokenIndex]) {
                    matchWithHighlights += surroundBefore + searchSet[i][stringIndex] + surroundAfter;
                    matchedPositions.push(stringIndex);
                    tokenIndex++;
    
                    if (tokenIndex >= tokens.length) {
                        matches.push(matchWithHighlights + searchSet[i].slice(stringIndex + 1));
                        break;
                    }
                } else {
                    matchWithHighlights += searchSet[i][stringIndex];
                }
    
                stringIndex++;
            }
        };

        // Order by number of occurrences (requires surrounding)
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
