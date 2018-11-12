/**
 * @overview complement
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isPlainObject = require('./is-plain-object');
const isObject = require('./is-object');
const complement = module.exports = (dst, src, depth) => {
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return dst === undefined ? src : dst;
  if (!isObject(dst)) {
    if (dst !== undefined) return dst;
    dst = {};
  }
  __complement(dst, src, depth);
  return dst;
};
const __complement = complement.base = (dst, src, depth) => {
  depth--;
  let k, to, from, dp = depth > -1;
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if ((to = dst[k]) === undefined) {
      dp && isPlainObject(from)
        ? __complement(dst[k] = {}, from, depth)
        : (dst[k] = from);
      continue;
    }
    dp && isObject(to) && isPlainObject(from) && __complement(to, from, depth);
  }
  return dst;
};
