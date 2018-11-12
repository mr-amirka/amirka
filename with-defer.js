
const immediate = require('./immediate');
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
    immediate(exec);
		return result;
	};
};
