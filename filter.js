/**
 * @overview filter
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isArray = require('./isArray');

module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || [];
  iteratee = iterateeNormalize(iteratee);
  let hasArray = isArray(dst), v, k = 0, l; // eslint-disable-line
  if (hasArray || isArray(collection)) {
    dst = dst || [];
    for (l = collection && collection.length || 0; k < l; k++) iteratee(v = collection[k], k) && dst.push(v); // eslint-disable-line
  } else {
    dst = dst || {};
    for (k in collection) iteratee(v = collection[k], k) && (dst[k] = v); // eslint-disable-line
  }
  return dst;
};
