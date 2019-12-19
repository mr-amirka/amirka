/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const unslash = require('./unslash');
const push = require('./push');
const map = require('./map');

module.exports = (separator) => {
  separator = isRegExp(separator)
    ? (separator = separator.toString()).substr(1, separator.length - 2)
    : escapeRegExp(separator);
  const regexp = new RegExp('(\\\\.)|(' + separator + ')', 'g');
  function escapedSplit(input, dstSeparators) {
    return map(base(input, dstSeparators), unslash);
  }
  function base(input, dstSeparators) {
    let lastOffset = 0;
    const output = [];
    let v = [];
    input.replace(regexp, function(all, escaped, separator) {
      const offset = arguments[arguments.length - 2]; // eslint-disable-line
      push(v, input.substr(lastOffset, offset - lastOffset));
      if (escaped) {
        push(v, escaped);
      } else {
        dstSeparators && push(dstSeparators, separator);
        push(output, v.join(''));
        v = [];
      }
      lastOffset = offset + all.length;
    });
    push(v, input.substr(lastOffset));
    return push(output, v.join(''));
  }
  escapedSplit.base = base;
  return escapedSplit;
};
