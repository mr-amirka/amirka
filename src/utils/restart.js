/**
 * @overview one
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (fn) => {
	let _cancel = () => {};
	const instance = function() {
		_cancel();
		_cancel = fn.apply(this, arguments);
		return cancel;
	};
	const cancel = instance.cnacel = () => _cancel();
	return instance;
};
