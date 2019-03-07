const __forEach = [].forEach;
module.exports = (collection, iteratee, hasArray) => {
  if (hasArray || collection instanceof Array) {
    __forEach.call(collection, iteratee);
  } else {
    for (let k in collection) iteratee(collection[k], k);
  }
};
