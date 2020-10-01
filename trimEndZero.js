const padEnd = require('./padEnd');
const reZero =/\.?0+$/g;

module.exports = (v, padLength) => {
  padLength = padLength || 0;
  const parts = ('' + v).split('.'), left = parts[0]; // eslint-disable-line
  return padLength > 0 ? (
    left + '.' + padEnd((parts[1] || '').replace(reZero, ''), padLength, '0')
  ) : left;
};
