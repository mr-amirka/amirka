/**
 * @overview destroyProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isFunction = require('./isFunction');
const forEach = require('./forEach');
const eachApply = require('./eachApply');
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
