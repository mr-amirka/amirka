
module.exports = (obj, iteratee) => {
  let k;
  for (k in obj) iteratee(obj[k], k); // eslint-disable-line
  return obj;
};
