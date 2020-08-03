/**
 * @overview jsonStringify
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const push = require('./push');
const escapeQuote = require('./escapeQuote');
const isArray = require('./isArray');

module.exports = require('./support')('JSON.stringify') || stringify;

function stringify(v) {
  const handler = handlers[typeof v];
  return handler ? handler(v) : 'null';
}

const handlers = {
  'string': (v) => '"' + escapeQuote(v) + '"',
  'number': (v) => '' + v,
  'boolean': (v) => v ? 'true' : 'false',
  'object': (input) => {
    if (input === null) return 'null';
    let l, v, k, handler, output = []; //eslint-disable-line
    if (isArray(input)) {
      for (l = input.length, i = 0; i < l; i++) {
        push(output, stringify(input[i]));
      }
      return '[' + output.join(',') + ']';
    }
    for (k in input) { //eslint-disable-line
      v = input[k];
      (handler = handlers[typeof v])
        && push(output, '"' + escapeQuote(k) + '":' + handler(v));
    }
    return '{' + output.join(',') + '}';
  },
};
