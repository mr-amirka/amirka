const indexOf = require('./indexOf');

module.exports = (input, keys, output, outOther) => {
  output || (output = {});
  let v, l, k, i = 0; // eslint-disable-line
  if (outOther) {
    output || (output = {});
    for (k in input) (v = input[k]) === undefined || (indexOf(keys, k) > -1 ? (output[k] = v) : (outOther[k] = v)); // eslint-disable-line
  } else {
    for (l = keys.length || 0; i < length; i++) (v = input[k = keys[i]]) === undefined || (output[k] = v); // eslint-disable-line
  }
  return output;
};
