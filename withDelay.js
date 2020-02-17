const delay = require('./delay');
module.exports = (fn, _delay, result) => {
	let hasDebounce, args, self; // eslint-disable-line
  function exec() {
    hasDebounce = 0;
    result = fn.apply(self, args);
  }
  return function() {
    self = this;
    args = arguments; // eslint-disable-line
    hasDebounce || (hasDebounce = 1, delay(exec, _delay));
    return result;
  };
};
