
const delay = require('./delay');
module.exports = (fn, _delay, result) => {
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
    delay(exec, _delay);
		return result;
	};
};
