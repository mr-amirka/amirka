/**
 * @overview flagsSet
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 * @example
 * flags([ 'apple', 'ban', 'test.use' ]); // =>
 * {
 *   apple: true,
 *   ban: true,
 *   test: {
 *     use: true
 *   }
 * }
 *
 */
const set = require('./set');
const reduce = require('./reduce');
module.exports = (flags, dst) => reduce(flags, reducer, dst || {});
const reducer = (dst, key) => {
  set(dst, key, true);
  return dst;
};
