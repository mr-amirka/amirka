
const isLength = require('./is-length');
module.exports = function(collection, iteratee, accumulator) {
  const length = collection && collection.length;//, hasDefined = arguments.length > 2;
  if (isLength(length)) {
    //hasDefined || (accumulator = []);
    for (let i = 0; i < length; i++) accumulator = iteratee(accumulator, collection[i], i);
  } else {
    //hasDefined || (accumulator = {});
    for (let k in collection) accumulator = iteratee(accumulator, collection[k], k);
  }
  return accumulator;
};
