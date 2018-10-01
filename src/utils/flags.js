/**
 * @overview flags
 * @author Absolutely Amir <mr.amirka@ya.ru>
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
const flags = module.exports = (flags, dst) => {
  dst || (dst = {});
  flags.forEach(v => set(dst, v, true));
  return dst;
};
flags.simple = (flags, dst) => {
  dst || (dst = {});
  flags.forEach(v => dst[v] = true);
  return dst;
};
