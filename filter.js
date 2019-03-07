/**
 * @overview filter
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');

module.exports = (collection, iteratee, dst) => {
  const hasArray = dst instanceof Array;
  if (!collection) return dst || [];
  const _iteratee = iterateeNormalize(iteratee);
  const length = collection.length;
  let v;
  if (hasArray || collection instanceof Array) {
    dst || (dst = []);
    const length = collection.length || 0;
    for (let i = 0; i < length; i++) {
      if (_iteratee(v = collection[i], i)) dst.push(v);
    }
  } else {
    dst || (dst = {});
    for (let k in collection) {
      if (_iteratee(v = collection[k], k)) dst[k] = v;
    }
  }
  return dst;
};
