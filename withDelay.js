const delay = require('./delay');
module.exports = (fn, _delay, result) => {
	let hasDebounce, args, self; // eslint-disable-line
  function exec() {
    hasDebounce = false;
    result = fn.apply(self, args);
  }
  return function() {
    self = this;
    args = arguments; // eslint-disable-line
    if (hasDebounce) return result;
    hasDebounce = true;
    delay(exec, _delay);
    return result;
  };
};
