/**
 * @overview cloneDepth
 * Копирует объект до определенной вторым аргументом глубины
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


const isLength = require('./is-length');

const cloneDepth = module.exports = (src, depth) => __cloneDepth(src, depth || 0);
const __cloneDepth = cloneDepth.core = (src, depth) => {
  if (depth < 0) return src;
  depth--;
  if (src && typeof src === 'object') {
    if (Object.getPrototypeOf(src)) {
      let i = src.length;
      if (isLength(i)) {
        let dst = new Array(i);
        for (; i--;) dst[i] = __cloneDepth(src[i], depth);
        return dst;
      }
    } else {
      let k, dst = {};
      for (k in src) dst[k] = __cloneDepth(src[k], depth);
      return dst;
    }

  }
  return src;
};