/**
 * @overview throttle
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const delay = require('./delay');
module.exports = (fn, _delay) => {
	let hasDebounce, result, self, args, hasCalled;
	const exec = () => {
		if (hasCalled) {
			hasCalled = false;
			result = fn.apply(self, args);
			delay(exec, _delay);
		} else {
			hasDebounce = false;
		}
	};
	return function() {
		if (hasDebounce) {
			self = this;
			args = arguments;
			hasCalled = true;
			return result;
		}
		hasDebounce = true;
		delay(exec, _delay);
		return result = fn.apply(this, arguments);
	};
};
