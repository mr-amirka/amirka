const __delay = require('./delay');

module.exports = (fn, delay) => {
  let hasDebounce, result; // eslint-disable-line
  function free() {
    hasDebounce = 0;
  }
  return function() {
    if (hasDebounce) return result;
    hasDebounce = 1;
    __delay(free, delay);
    return result = fn.apply(this, arguments); // eslint-disable-line
  };
};
