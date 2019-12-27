const delay = require('./delay');

module.exports = (fn, _delay) => {
  let hasDebounce, result, self, args, hasCalled; // eslint-disable-line
  function exec() {
    hasCalled
      ? (hasCalled = 0, delay(exec, _delay), result = fn.apply(self, args))
      : (hasDebounce = 0);
  }
  return function() {
    self = this;
    args = arguments; // eslint-disable-line
    return hasDebounce
      ? (hasCalled = 1, result)
      : (hasDebounce = 1, delay(exec, _delay), result = fn.apply(self, args));
  };
};
