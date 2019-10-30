
module.exports = (collection, iteratee, accumulator, hasArray) => {
  if (hasArray || collection && (collection instanceof Array)) {
    for (var length = collection && collection.length || 0, i = 0; i < length; i++) accumulator = iteratee(accumulator, collection[i], i);
  } else {
    for (var k in collection) accumulator = iteratee(accumulator, collection[k], k);
  }
  return accumulator;
};
