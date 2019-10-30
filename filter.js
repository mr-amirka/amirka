/**
 * @overview filter
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');

module.exports = (collection, iteratee, dst) => {
  const hasArray = dst && (dst instanceof Array);
  if (!collection) return dst || [];
  const _iteratee = iterateeNormalize(iteratee);
  let v;
  if (hasArray || collection && (collection instanceof Array)) {
    dst || (dst = []);
    const length = collection.length || 0;
    for (let i = 0; i < length; i++) _iteratee(v = collection[i], i) && dst.push(v);
  } else {
    dst || (dst = {});
    for (let k in collection) _iteratee(v = collection[k], k) && (dst[k] = v);
  }
  return dst;
};
