/**
 * @overview JSON
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const push = require('./push');
const support = require('./support');
const escapeQuote = require('./escapeQuote');

module.exports = support('JSON') || {
  stringify(v) {
    const handler = handlers[typeof v];
    return handler ? handler(v) : 'null';
  },
  parse(v) {
    try {
      return (new Function('return ' + v)).call(null);
    } catch (ex) {}
    return null;
  },
};

const handlers = {
  'string': (v) => '"' + escapeQuote(v) + '"',
  'number': (v) => '' + v,
  'boolean': (v) => v ? 'true' : 'false',
  'object': (input) => {
    if (input === null) return 'null';
    var l, v, k, handler, output = []; //eslint-disable-line
    if (input instanceof Array) {
      for (l = input.length, i = 0; i < l; i++) {
        v = input[i];
        push(output, (handler = handlers[typeof v]) ? handler(v) : 'null');
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
