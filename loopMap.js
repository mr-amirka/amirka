
//const isFunction = require('./is-function');

module.exports = (length, fn, output, start) => {
  output || (output = new Array(length));
  for (let i = start || 0; i < length; i++) output[i] = fn(i);
  return output;
};
