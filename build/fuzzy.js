'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var isArray = function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

var fuzzy = {
    /**
     * Tests if a string matches a pattern
     * @param  {String}  q             The pattern
     * @param  {String}  str           The string
     * @param  {Boolean} caseSensitive True if case sensitive should count
     * @return {Boolean} True if the string matches, false otherwise
     */

    test: function test(q, str) {
        var caseSensitive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        if (typeof q !== 'string' || typeof str !== 'string') {
            return -1;
        }

        if (!str) {
            return -1;
        }

        if (!q) {
            return true;
        }

        if (!caseSensitive) {
            q = q.toLowerCase();
            str = str.toLowerCase();
        }

        var pos = 0;
        var i = 0;

        while (i < str.length) {

            if (str[i] === q[pos]) {
                pos += 1;
            }

            ++i;
        }

        return pos === q.length;
    },


    /**
     * Tests if a string matches a pattern and return a score
     * @param  {String} q    The pattern
     * @param  {String} str  The string
     * @param  {Object} opts Options containing `caseSensitive` `before` and `after`
     * @return {Object} Object containing score and surrounded (or intact) result
     */
    match: function match(q, str, opts) {
        if (typeof q !== 'string' || typeof str !== 'string') {
            return { score: 0, result: str };
        }

        if (!str) {
            return { score: 0, result: str };
        }

        if (!q) {
            return { score: 1, result: str };
        }

        opts = _extends({
            caseSensitive: false,
            before: '',
            after: ''
        }, opts);

        if (!opts.caseSensitive) {
            q = q.toLowerCase();
            str = str.toLowerCase();
        }

        // String with surrounded results
        var result = '';

        // Number of spaces between matches
        var steps = 0;

        // Actual pattern position
        var pos = 0;

        // Last match position
        var lastI = 0;

        var i = 0;
        while (i < str.length) {
            var c = str[i];

            if (c === q[pos]) {
                result += opts.before + c + opts.after;

                // Move to the next pattern character
                pos += 1;

                // Add spaces between the last match to steps
                steps += i - lastI;

                // Reset counter to the actual position in string
                lastI = i;
            } else {
                result += c;
            }

            ++i;
        }

        if (pos === q.length) {
            // Score between 0 and 1 calculated by the number of spaces
            // between letters and the string length.
            // The biggest the score is the better
            var score = q.length / (steps + 1);

            return { score: score, result: result };
        }

        return { score: 0, result: str };
    },


    /**
     * Filters an array based on the pattern
     * @param  {String}        q    The pattern
     * @param  {Array<String>} set  An array of queries
     * @param  {Object}        opts Options containing `caseSensitive` `before` and `after`
     * @return {Array<String>} A sorted array of results
     */
    filter: function filter(q, set, opts) {
        if (!isArray(set)) {
            return [];
        }

        if (typeof q !== 'string' || !q) {
            return set;
        }

        opts = _extends({
            caseSensitive: false,
            before: '',
            after: ''
        }, opts);

        var results = [];

        var i = 0;
        while (i < set.length) {
            var str = set[i];
            var result = fuzzy.match(q, str, opts);

            if (result.score > 0) {
                results.push(result);
            }

            ++i;
        }

        return results.sort(function (a, b) {
            return b.score - a.score;
        }).map(function (elem) {
            return elem.result;
        });
    }
};

/* istanbul ignore next */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.returnExports = factory();
    }
})(undefined, function () {
    return fuzzy;
});