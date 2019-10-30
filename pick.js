/**
 * @overview pick
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const indexOf = require('./indexOf');

module.exports = (input, keys, output, outOther) => {
  output || (output = {});
  let v, k, i;
  if (outOther) {
    output || (output = {});
    for (k in input) (v = input[k]) === undefined || (indexOf(keys, k) > -1 ? (output[k] = v) : (outOther[k] = v));
  } else {
    const length = keys.length || 0;
    for (i = 0; i < length; i++) (v = input[k = keys[i]]) === undefined || (output[k] = v);
  }
  return output;
};
