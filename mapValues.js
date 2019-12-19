/**
 * @overview mapValues
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (input, iteratee) => {
  const output = {};
  let k;
  for (k in input) output[k] = iteratee(input[k], k); // eslint-disable-line
  return output;
};
