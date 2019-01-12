/**
 * @overview destroyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isFunction = require('./is-function');
const forEach = require('./for-each');
const eachApply = require('./each-apply');
module.exports = function() {
	let destroyers = [];
	const instance = () => {
		const _destroyers = destroyers;
		destroyers = null;
		_destroyers && eachApply(_destroyers);
		return instance;
	};
	forEach(arguments, instance.add = (fn) => {
		isFunction(fn) && (destroyers ? destroyers.push(fn) : fn());
		return instance;
	});
  instance.clear = () => {
		if (destroyers) destroyers = [];
		return instance;
	};
	return instance;
};
