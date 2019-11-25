/**
 * @overview polyfill
 * Подгружает полифилы, если нет оригинальной реализации
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 * @example
 *
 * polyfill({
 *   'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
 *   'Promise': 'assets/standalone-shims/promise.shim.js'
 * }, window);
 *
 */

const extend = require('../extend');
const forIn = require('../forIn');
const baseGet = require('../get').base;
const baseSet = require('../set').base;
const isPromise = require('../isPromise');
const Deal = require('../CancelablePromise');
const script = require('./script');

const readyProvider = require('./readyProvider');
const gl = require('./_global');

const polyfill = module.exports = (_map, _global) => {
	_global || (_global = gl);
	const map = extend({ 'Promise': Deal }, _map);
	const promises = [];
	forIn(map, (value, subjectPath) => {
		const path = subjectPath.split('.');
		if (baseGet(_global, path) || !value) return;
		const type = typeof value;
		if (type === 'function') {
			return isPromise(value = value())
				? promises.push(value.finally((err, v) => v && baseSet(_global, path, v)))
				: baseSet(_global, path, value);
		}
		if (type === 'string') {
			return promises.push(script(value));
		}
		isPromise(value)
			? promises.push(value.finally((err, v) => v && baseSet(_global, path, v)))
			: baseSet(_global, path, value);
	})
	return Deal.all(promises);
};
polyfill.andReady = (_map, _global) =>
	polyfill(_map, _global).then(() => new Deal(resolve => readyProvider(_global || gl)(resolve)));
