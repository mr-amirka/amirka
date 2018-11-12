/**
 * @overview pick
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const reduce = require('./reduce');

module.exports = (src, keys, dst) => reduce(keys, (dst, key) => {
  const value = src[key];
  value === undefined || (dst[key] = value);
  return dst;
}, dst || {});
