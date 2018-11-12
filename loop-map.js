
module.exports = (length, fn, output, start) => {
  output || (output = []);
  for (let i = start || 0; i < length; i++) output[i] = fn(i);
  return output;
};
