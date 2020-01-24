const isArray = require('./isArray');
const isMatch = require('./isMatch');
const isFunction = require('./isFunction');

module.exports = (collection, identity, hasArray, l, k) => {
  const _identity = isFunction(identity)
    ? identity
    : ((v) => isMatch(v, identity));
  if (hasArray || isArray(collection)) {
    for (k = 0, l = collection && collection.length || 0; k < l; k++) {
      if (!_identity(collection[k])) return 0;
    }
  } else {
    for (k in collection) { // eslint-disable-line
      if (!_identity(collection[k])) return 0;
    }
  }
  return 1;
};
