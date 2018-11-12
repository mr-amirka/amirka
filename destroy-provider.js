/**
 * @overview destroyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isFunction = require('./is-function');
const forEach = require('./for-each');
const eachApply = require('./each-apply');
module.exports = function() {
	let destroyers = [];
	const instance = function () {
		const _destroyers = destroyers;
		destroyers = [];
		eachApply(_destroyers, arguments, this);
		return instance;
	};
	forEach(arguments, instance.add = (fn) => {
		isFunction(fn) && destroyers.push(fn);
		return instance;
	});
	return instance;
};
