/**
 * @overview map
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');

module.exports = (collection, iteratee, dst) => {
  const hasArray = dst instanceof Array;
  if (!collection) return dst || {};
  const _iteratee = iterateeNormalize(iteratee);
  if (hasArray || collection instanceof Array) {
    const length = collection.length || 0;
    dst || (dst = new Array(length));
    for (let i = 0; i < length; i++) dst[i] = _iteratee(collection[i], i);
  } else {
    dst || (dst = {});
    for (let k in collection) dst[k] = _iteratee(collection[k], k);
  }
  return dst;
};
