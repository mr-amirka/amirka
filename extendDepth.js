/**
 * @overview extendDepth
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');

const extendDepth = module.exports = (dst, src, depth) => {
  if (src === undefined) return dst;
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return src;
  __extendDepth(isObject(dst) ? dst : (dst = {}), src, depth);
  return dst;
};
const __extendDepth = extendDepth.base = (dst, src, depth) => {
  depth--;
  let k, to, from, dp = depth > -1;
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if (dp && isPlainObject(from)) {
      __extendDepth(isObject(to = dst[k]) ? to : (dst[k] = {}), from, depth);
      continue
    }
    dst[k] = from;
  }
};