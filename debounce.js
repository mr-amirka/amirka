/**
 * @overview debounce
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const noop = require('./noop');
module.exports = (fn, _delay) => {
	let hasDebounce, result;
	const free = () => hasDebounce = false;
	return function() {
		if (hasDebounce) return result;
		hasDebounce = true;
		delay(free, _delay);
		return result = fn.apply(this, arguments);
	};
};
