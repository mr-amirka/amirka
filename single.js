/**
 * @overview single
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isPromise = require('./isPromise');
const isFunction = require('./isFunction');

module.exports = (fn) => {
	let _cancel;
	const instance = function() {
    cancel();
		return _cancel = fn.apply(this, arguments);
	};
	const cancel = instance.cancel = () => cancelApply(_cancel);
	return instance;
};

const cancelApply = (cancel) => {
  if (!cancel) return;
  if (isFunction(cancel)) return cancel();
  isPromise(cancel) && isFunction(cancel.cancel) && cancel.cancel();
};
