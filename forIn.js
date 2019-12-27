module.exports = (obj, iteratee, k) => {
  for (k in obj) iteratee(obj[k], k); // eslint-disable-line
  return obj;
};
