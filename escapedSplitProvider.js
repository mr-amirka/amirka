const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const unslash = require('./unslash');
const push = require('./push');
const map = require('./map');
const joinOnly = require('./joinOnly');

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
      const args = arguments, offset = args[args.length - 2]; // eslint-disable-line
      push(v, input.substr(lastOffset, offset - lastOffset));
      escaped
        ? push(v, escaped)
        : (
          dstSeparators && push(dstSeparators, separator),
          push(output, joinOnly(v)),
          v = []
        );
      lastOffset = offset + all.length;
    });
    push(v, input.substr(lastOffset));
    return push(output, joinOnly(v));
  }
  escapedSplit.base = base;
  return escapedSplit;
};
