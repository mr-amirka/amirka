
const defer = require('./defer');
module.exports = (fn, result) => {
	let hasDebounce, args, self;
	const exec = () => {
    hasDebounce = false;
    result = fn.apply(self, args);
  };
	return function() {
    self = this;
    args = arguments;
		if (hasDebounce) return result;
		hasDebounce = true;
    defer(exec);
		return result;
	};
};
