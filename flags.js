/**
 * @overview flags
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 * @example
 * flags([ 'apple', 'ban' ]); // =>
 * {
 *   apple: true,
 *   ban: true,
 * }
 *
 */
const reduce = require('./reduce');
module.exports = (flags, dst) => reduce(flags, (dst, key) => {
  dst[key] = true;
  return dst;
}, dst || {});
