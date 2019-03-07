/**
 * @overview pick
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (input, keys, output, outOther) => {
  output || (output = {});
  let v, k, i;
  if (outOther) {
    output || (output = {});
    for (k in input) (v = input[k]) === undefined || (keys.indexOf(k) > -1 ? (output[k] = v) : (outOther[k] = v));
  } else {
    const length = keys.length || 0;
    for (i = 0; i < length; i++) (v = input[k = keys[i]]) === undefined || (output[k] = v);
  }
  return output;
};
