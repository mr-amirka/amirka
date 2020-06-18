/**
 * @overview find
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isArray = require('./isArray');

module.exports = (collection, iteratee, hasArray) => {
  if (!collection) return;
  iteratee = iterateeNormalize(iteratee);
  let v, k = 0, l; // eslint-disable-line
  if (hasArray || isArray(collection)) {
    for (l = collection.length || 0; k < l; k++) {
      if (iteratee(v = collection[k], k)) return v;
    }
  } else {
    for (k in collection) {
      if (iteratee(v = collection[k], k)) return v;
    }
  }
};
