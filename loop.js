
module.exports = (length, fn, start) => {
  for (let i = start || 0; i < length; i++) fn(i);
};
