
module.exports = (collection, iteratee, accumulator, hasArray) => {
  if (hasArray || collection instanceof Array) {
    const length = collection.length;
    for (let i = 0; i < length; i++) accumulator = iteratee(accumulator, collection[i], i);
  } else {
    for (let k in collection) accumulator = iteratee(accumulator, collection[k], k);
  }
  return accumulator;
};
