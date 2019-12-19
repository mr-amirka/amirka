
module.exports = (length, fn, start) => {
  let i = start || 0;
  for (; i < length; i++) fn(i);
};
