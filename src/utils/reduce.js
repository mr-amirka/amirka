
const isLength = require('./is-length');
module.exports = function(collection, iteratee, accumulator) {
  const length = collection.length, hasDefined = arguments.length > 2;
  if (isLength(length)) {
    hasDefined || (accumulator = []);
    for (let i = 0; i < length; i++) iteratee(accumulator, collection[i], i);
  } else {
    hasDefined || (accumulator = {});
    for (let k in collection) iteratee(accumulator, collection[k], k);
  }
  return accumulator;
};
