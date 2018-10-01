/**
 * @overview throttleCancelable
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const restart = require('./restart');
module.exports = (fn, _delay) => {
	let hasDebounce, self, args, hasCalled, _cancel;
	const exec = () => {
		let _hasCalled = hasCalled;
		hasCalled = hasDebounce = false;
		_hasCalled && fn.apply(self, args);
	};
	const cnacel = () => {
		hasCalled = hasDebounce = false;
		_cancel();
	};
	return restart(function() {
		if (hasDebounce) {
			self = this;
			args = arguments;
			hasCalled = true;
			return _cancel;
		}
		hasDebounce = true;
		fn.apply(this, arguments);
		_cancel = delay(exec, _delay);
		return cnacel;
	});
};
