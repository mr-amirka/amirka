const isObject = require('./isObject');
const isArray = require('./isArray');

module.exports = (m, k) => {
  if (!m && m !== 0) return 1;
  if (!isObject(m)) return 0;
  if (isArray(m)) return m.length < 1;
  for (k in m) return 0; // eslint-disable-line
  return 1;
};
