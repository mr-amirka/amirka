const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const map = require('./map');
const unslash = require('./unslash');

module.exports = (separator) => {
  separator = isRegExp(separator)
    ? (separator = separator.toString()).substr(1, separator.length - 2)
    : escapeRegExp(separator);
  const regexp = new RegExp('(\\\\.)|(' + separator + '(.*)$)', 'g');
  function instance(input) {
    return map(base(input), unslash);
  }
  function base(input) {
    let prefix = input, value = '', suffix = ''; // eslint-disable-line
    input.replace(regexp, (all, escaped, _suffix, _value, offset) => {
      escaped || (
        suffix = _suffix,
        value = _value,
        prefix = input.substr(0, offset)
      );
    });
    return [prefix, suffix, value];
  }
  instance.base = base;
  return instance;
};
