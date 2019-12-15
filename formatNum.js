
const half = require('./half');

module.exports = (v, fixed, dot, space) => {
  let val;
  if (isNaN(val = parseFloat(v || 0)) || !isFinite(val)) return v;
  space === undefined && (space = ' ');
  fixed === undefined && (fixed = 0);
  val = val.toFixed(fixed);
  const parts = half(val, '.');
  val = parts[0];
  let result = '', balance, i = 0;
  for (; i < val.length; i++) {
    balance = (val.length - i) % 3;
    if (!balance && i) result += space;
    result += val[i];
  }
  return parts[1] ? (result + (dot ? dot : '.') + parts[1]) : result;
};
