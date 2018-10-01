/**
 * @overview map
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || {};
  const length = collection.length;
  if (isLength(length)) {
    dst || (dst = new Array(length));
    for (let i = 0; i < length; i++) dst[i] = iteratee(collection[i], i);
  } else {
    dst || (dst = {});
    for (let k in collection) dst[k] = iteratee(collection[k], k);
  }
  return dst;
};
