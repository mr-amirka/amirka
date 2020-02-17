const defer = require('./defer');
module.exports = (fn, result) => {
	let hasDebounce, args, self; // eslint-disable-line
  function exec() {
    hasDebounce = 0;
    result = fn.apply(self, args);
  }
  return function() {
    self = this;
    args = arguments; // eslint-disable-line
    hasDebounce || (hasDebounce = 1, defer(exec));
    return result;
  };
};
