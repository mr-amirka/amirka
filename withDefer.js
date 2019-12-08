const defer = require('./defer');
module.exports = (fn, result) => {
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
    defer(exec);
    return result;
  };
};
