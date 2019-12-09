module.exports = (length, fn, output, start) => {
  output || (output = new Array(length));
  let i = start || 0;
  for (; i < length; i++) output[i] = fn(i);
  return output;
};
