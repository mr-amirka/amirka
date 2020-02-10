const isArray = require('../isArray');

function isHasFunctions(src) {
  if (src) {
    let k, length, type = typeof src; // eslint-disable-line
    if (type === 'function') return 1;
    if (type === 'object') {
      if (isArray(src)) {
        for (k = 0, length = src.length; k < length; k++) {
          if (isHasFunctions(src[k])) return 1;
        }
      } else {
        for (k in src) {
          if (isHasFunctions(src[k])) return 1;
        }
      }
    }
  }
}

module.exports = isHasFunctions;
