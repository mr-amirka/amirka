/**
 * @overview JSON
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const JSON = module.exports = window.JSON || (window.JSON = {});
JSON.stringify || (JSON.stringify = function(v) {
  const handler = handlers[typeof v];
  return handler ? handler(v) : 'null';
});
JSON.parse || (JSON.parse = function(v) {
  try {
    return (new Function(
        // reset
        'window', 'document', 'location', 'history', 'navigator', 'JSON',
        'Array', 'Object', 'String', 'Number', 'Function', 'Promise',
        'XMLHttpRequest', 'ActiveXObject',
        'eval',
        'return ' + v,
    )).call(null);
  } catch (ex) {}
  return null;
});

function escapeQuote(v) {
  return v.replace(/(["\\])/g, '\\$1');
}
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
        output.push((handler = handlers[typeof v]) ? handler(v) : 'null');
      }
      return '[' + output.join(',') + ']';
    }
    for (k in input) { //eslint-disable-line
      v = input[k];
      if (handler = handlers[typeof v]) {
        output.push('"' + escapeQuote(k) + '":' + handler(v));
      }
    }
    return '{' + output.join(',') + '}';
  },
};
