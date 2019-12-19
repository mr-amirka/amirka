/**
 * @overview map
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');

module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || {};
  const hasArray = dst && (dst instanceof Array);
  const _iteratee = iterateeNormalize(iteratee);
  let k, length; // eslint-disable-line
  if (hasArray || collection && (collection instanceof Array)) {
    length = collection.length || 0;
    dst || (dst = new Array(length));
    for (k = 0; k < length; k++) dst[k] = _iteratee(collection[k], k);
  } else {
    dst || (dst = {});
    for (k in collection) dst[k] = _iteratee(collection[k], k); // eslint-disable-line
  }
  return dst;
};
