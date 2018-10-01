/**
 * @overview destroyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const eachApply = require('./each-apply');
module.exports = function(){
	let destroyers = [];
	const instance = function () {
		const _destroyers = destroyers;
		destroyers = []
		eachApply(_destroyers, arguments, this);
		return instance;
	};
	[].forEach.call(arguments, instance.add = (fn) => {
		typeof fn === 'function' && destroyers.push(fn);
		return instance;
	});
	return instance;
};
