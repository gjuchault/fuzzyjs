// Improved from Bulat Bochkariov's version (http://www.quora.com/Algorithms/How-is-the-fuzzy-search-algorithm-in-Sublime-Text-designed)
const fuzzy = (searchSet, query, opts_) => {
    const opts = Object.assign({
        caseSensitive: false,
        before: '',
        after: ''
    }, opts_);

    if (!query) {
        return searchSet;
    }

    const tokens = opts.caseSensitive ? query.split('') : query.toLowerCase().split('');
    let matches  = [];
    const l      = searchSet.length;
    let i        = 0;

    for (i; i < l; ++i) {
        // tokenIndex          : query letter index
        // stringIndex         : current possible result letter index
        // matchWithHighlights : string containing result
        // stringLC            : lower-case search, or not

        let tokenIndex          = 0;
        let stringIndex         = 0;
        let matchWithHighlights = '';
        const matchedPositions  = [];
        const stringLC          = opts.caseSensitive ? searchSet[i] : searchSet[i].toLowerCase();

        while (stringIndex < searchSet[i].length) {
            // [Still] same letter
            if (stringLC[stringIndex] === tokens[tokenIndex]) {
                matchWithHighlights += opts.before + searchSet[i][stringIndex] + opts.after;
                matchedPositions.push(stringIndex);
                ++tokenIndex;

                if (tokenIndex >= tokens.length) {
                    matches.push(matchWithHighlights + searchSet[i].slice(stringIndex + 1));
                    break;
                }
            } else {
                matchWithHighlights += searchSet[i][stringIndex];
            }

            ++stringIndex;
        }
    }

    // Order by number of occurrences (requires surrounding)
    if (opts.before.length > 0) {
        matches = matches.sort((a, b) => {
            const scoreA = a.split(opts.before).length - 1;
            const scoreB = b.split(opts.before).length - 1;

            return scoreA - scoreB;
        });
    }

    return matches;
};

/* istanbul ignore next */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.returnExports = factory();
  }
}(this, function () {
    return fuzzy;
}));
