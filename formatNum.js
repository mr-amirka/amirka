
const half = require('./half');

module.exports = (v, fixed, dot, space) => {
  let val;
  if (isNaN(val = parseFloat(v || 0)) || !isFinite(val)) return v;
  space === undefined && (space = ' ');
  fixed === undefined && (fixed = 0);
  const parts = half(val.toFixed(fixed), '.');
  val = parts[0];
  let result = '', balance, i = 0, l = val.length, right = parts[1]; // eslint-disable-line
  for (; i < l; i++) {
    balance = (l - i) % 3;
    if (!balance && i) result += space;
    result += val[i];
  }
  return right ? (result + (dot ? dot : '.') + right) : result;
};
