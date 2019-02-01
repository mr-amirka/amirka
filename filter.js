/**
 * @overview filter
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
const iterateeNormalize = require('./iteratee-normalize');

module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || [];
  const _iteratee = iterateeNormalize(iteratee);
  const length = collection.length;
  let v;
  if (isLength(length)) {
    dst || (dst = []);
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
