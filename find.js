/**
 * @overview filter
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');

module.exports = (collection, iteratee, hasArray) => {
  if (!collection) return;
  const _iteratee = iterateeNormalize(iteratee);
  let v;
  if (hasArray || collection instanceof Array) {
    const length = collection.length || 0;
    for (let i = 0; i < length; i++) {
      if (_iteratee(v = collection[i], i)) return v;
    }
  } else {
    for (let k in collection) {
      if (_iteratee(v = collection[k], k)) return v;
    }
  }
};
