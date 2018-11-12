
module.exports = function(collection, iteratee, accumulator) {
  arguments.length > 2 || (accumulator = {});
  for (let k in collection) accumulator = iteratee(accumulator, collection[k], k);
  return accumulator;
};
