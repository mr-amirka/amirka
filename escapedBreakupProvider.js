/**
 * @overview escapedBreakupProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\)
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const mapValues = require('./mapValues');
const unslash = require('./unslash');

module.exports = (separator) => {
  separator = isRegExp(separator)
    ? (separator = separator.toString()).substr(1, separator.length - 2)
    : escapeRegExp(separator);
  const regexp = new RegExp('(\\\\.)|(' + separator + '(.*)$)', 'g');
  const instance = (input) => mapValues(core(input), unslash);
  const core = instance.base = (input) => {
    let prefix = input;
    let suffix = '';
    let value = '';
    input.replace(regexp, (all, escaped, _suffix, _value, offset) => {
      if (escaped) return '';
      suffix = _suffix;
      value = _value;
      prefix = input.substr(0, offset);
      return '';
    });
    return {prefix, suffix, value};
  };
  return instance;
};
