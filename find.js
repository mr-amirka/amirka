/**
 * @overview filter
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

 const isLength = require('./is-length');
 const iterateeNormalize = require('./iteratee-normalize');

module.exports = (collection, iteratee) => {
  if (!collection) return;
  const _iteratee = iterateeNormalize(iteratee);
  const length = collection.length;
  let v;
  if (isLength(length)) {
    for (let i = 0; i < length; i++) {
      if (_iteratee(v = collection[i], i)) return v;
    }
  } else {
    for (let k in collection) {
      if (_iteratee(v = collection[k], k)) return v;
    }
  }
};
