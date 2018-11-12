

const isLength = require('./is-length');
module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || [];
  iteratee || (iteratee = __iteratee);
  const length = collection.length;
  let v;
  if (isLength(length)) {
    dst || (dst = []);
    for (let i = 0; i < length; i++) {
      if (iteratee(v = collection[i], i)) dst[i] = v;
    }
  } else {
    dst || (dst = {});
    for (let k in collection) {
      if (iteratee(v = collection[k], k)) dst[k] = v;
    }
  }
  return dst;
};
const __iteratee = v => v;
